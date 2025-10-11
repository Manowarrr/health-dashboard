// MODULE_CONTRACT:
// PURPOSE: [Содержит все серверные действия (Server Actions) для приложения.
//           Обрабатывает мутации данных (создание, обновление, удаление) на сервере.]
// SCOPE: [Server Actions, Мутации данных, Бизнес-логика.]
// KEYWORDS_MODULE: [server-actions, data-mutation, supabase, zod]
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 2, Business Requirement: Прямой ввод калорий]

'use server';

import { createClient } from '../../lib/supabase/server';
import { z } from 'zod';
import { revalidatePath } from 'next/cache';

// START_ZOD_SCHEMA_addProductSchema
// CONTRACT:
// PURPOSE: [Определяет схему валидации для данных, поступающих из формы добавления продукта.]
const addProductSchema = z.object({
    name: z.string().min(2, { message: 'Название должно быть длиннее 2 символов' }),
    calories: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}),
    protein: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}),
    fat: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}),
    carbs: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}),
    fiber: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}).optional(),
    sugar: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}).optional(),
    alcohol: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}).optional(),
    caffeine: z.coerce.number().min(0, { message: 'Значение не может быть отрицательным'}).optional(),
});
// END_ZOD_SCHEMA_addProductSchema


// START_ZOD_SCHEMA_addFoodLogSchema
// CONTRACT:
// PURPOSE: [Определяет схему валидации для данных, поступающих из формы логирования приема пищи.]
const addFoodLogSchema = z.object({
    productId: z.string().uuid({ message: 'Необходимо выбрать продукт.' }),
    weight: z.coerce.number().positive({ message: 'Вес должен быть больше нуля.' }),
    mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack'], { message: 'Необходимо выбрать тип приема пищи.'}),
    time: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, { message: 'Неверный формат времени.' })
});
// END_ZOD_SCHEMA_addFoodLogSchema


// START_ZOD_SCHEMA_addRecipeSchema
// CONTRACT:
// PURPOSE: [Определяет схему валидации для данных, поступающих из формы добавления рецепта.]
const addRecipeSchema = z.object({
    name: z.string().min(2, { message: 'Название должно быть длиннее 2 символов' }),
    ingredients: z.array(z.object({
        productId: z.string().uuid(),
        weight: z.coerce.number().positive(),
    })).optional(),
});
// END_ZOD_SCHEMA_addRecipeSchema


// START_ZOD_SCHEMA_addMealSchema
// CONTRACT:
// PURPOSE: [Определяет схему валидации для данных, поступающих из формы конструктора приема пищи.]
const addMealSchema = z.object({
    mealType: z.enum(['breakfast', 'lunch', 'dinner', 'snack']),
    loggedAt: z.string(), // Assuming datetime-local input
    items: z.array(z.object({
        id: z.string().uuid(),
        type: z.enum(['product', 'recipe']),
        weight: z.coerce.number().positive().optional(),
    })).min(1, { message: 'Нужно добавить хотя бы один элемент в прием пищи.' }),
});
// END_ZOD_SCHEMA_addMealSchema


// START_TYPE_DEFINITION_FormState
// CONTRACT:
// PURPOSE: [Определяет структуру объекта состояния для форм, использующих Server Actions.]
export type FormState = {
    message: string | null;
    errors?: Record<string, string[] | undefined>;
    status?: 'success' | 'error';
};
// END_TYPE_DEFINITION_FormState


// START_SERVER_ACTION_addProduct
// CONTRACT:
// PURPOSE: [Обрабатывает отправку формы для добавления нового продукта в личный справочник пользователя.]
// INPUTS:
//   - previousState: FormState - Предыдущее состояние формы (для useFormState).
//   - formData: FormData - Данные, отправленные из HTML-формы.
// OUTPUTS:
//   - FormState - Новое состояние формы с сообщением об успехе или ошибке.
// SIDE_EFFECTS:
//   - Вставляет новую запись в таблицу 'products' в Supabase.
//   - Вызывает revalidatePath('/dashboard') для обновления UI.
export async function addProduct(previousState: FormState, formData: FormData): Promise<FormState> {
    // START_VALIDATION_BLOCK: [Валидация входящих данных формы с помощью Zod.]
    const validatedFields = addProductSchema.safeParse({
        name: formData.get('name'),
        calories: formData.get('calories'),
        protein: formData.get('protein'),
        fat: formData.get('fat'),
        carbs: formData.get('carbs'),
        fiber: formData.get('fiber'),
        sugar: formData.get('sugar'),
        alcohol: formData.get('alcohol'),
        caffeine: formData.get('caffeine'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Ошибка валидации. Пожалуйста, проверьте введенные данные.',
            errors: validatedFields.error.flatten().fieldErrors,
            status: 'error',
        };
    }
    // END_VALIDATION_BLOCK

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Ошибка: Пользователь не авторизован.', status: 'error' };
    }

    // START_ENSURE_USER_PROFILE_EXISTS: [Проверка и создание профиля пользователя в public.users, если он отсутствует.]
    const { error: upsertError } = await supabase.from('users').upsert({ id: user.id });
    if (upsertError) {
        console.error('User Profile Upsert Error:', upsertError);
        return { message: `Ошибка синхронизации профиля: ${upsertError.message}`, status: 'error' };
    }
    // END_ENSURE_USER_PROFILE_EXISTS

    // START_DB_INSERT_BLOCK: [Вставка проверенных данных в базу данных Supabase.]
    const { error } = await supabase.from('products').insert({
        user_id: user.id,
        name: validatedFields.data.name,
        calories_per_100g: validatedFields.data.calories,
        protein_per_100g: validatedFields.data.protein,
        fat_per_100g: validatedFields.data.fat,
        carbs_per_100g: validatedFields.data.carbs,
        fiber_per_100g: validatedFields.data.fiber || 0,
        sugar_per_100g: validatedFields.data.sugar || 0,
        alcohol_per_100g: validatedFields.data.alcohol || 0,
        caffeine_per_100g_mg: validatedFields.data.caffeine || 0,
    });

    if (error) {
        return { message: `Ошибка базы данных: ${error.message}`, status: 'error' };
    }
    // END_DB_INSERT_BLOCK

    revalidatePath('/dashboard');
    return { message: `Продукт "${validatedFields.data.name}" успешно добавлен!`, status: 'success' };
}
// END_SERVER_ACTION_addProduct


// START_TYPE_DEFINITION_Product
// CONTRACT:
// PURPOSE: [Определяет структуру объекта продукта для использования в UI.]
export type Product = {
    id: string;
    name: string;
    calories_per_100g: number;
    protein_per_100g: number;
    fat_per_100g: number;
    carbs_per_100g: number;
    fiber_per_100g?: number;
    sugar_per_100g?: number;
    alcohol_per_100g?: number;
    caffeine_per_100g_mg?: number;
};
// END_TYPE_DEFINITION_Product

// START_SERVER_ACTION_getProducts
// CONTRACT:
// PURPOSE: [Извлекает список всех продуктов, добавленных текущим пользователем, с возможностью фильтрации по названию.]
// INPUTS:
//   - query: string (optional) - Строка для поиска по названию продукта.
// OUTPUTS:
//   - Promise<Product[]> - Массив объектов продуктов.
export async function getProducts(query?: string): Promise<Product[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    let queryBuilder = supabase
        .from('products')
        .select('id, name, calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g, fiber_per_100g, sugar_per_100g, alcohol_per_100g, caffeine_per_100g_mg')
        .eq('user_id', user.id);

    // START_QUERY_FILTERING_BLOCK: [Если есть поисковый запрос, добавляем фильтр ilike.]
    if (query) {
        queryBuilder = queryBuilder.ilike('name', `%${query}%`);
    }
    // END_QUERY_FILTERING_BLOCK

    const { data, error } = await queryBuilder.order('name', { ascending: true });

    if (error) {
        console.error('Database Error:', error.message);
        throw new Error('Не удалось загрузить продукты.');
    }
    
    return data;
}
// END_SERVER_ACTION_getProducts


// START_SERVER_ACTION_addFoodLog
// CONTRACT:
// PURPOSE: [Обрабатывает отправку формы для записи приема пищи в журнал.]
export async function addFoodLog(previousState: FormState, formData: FormData): Promise<FormState> {
    const validatedFields = addFoodLogSchema.safeParse({
        productId: formData.get('productId'),
        weight: formData.get('weight'),
        mealType: formData.get('mealType'),
        time: formData.get('time'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Ошибка валидации.',
            errors: validatedFields.error.flatten().fieldErrors,
            status: 'error',
        };
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { message: 'Ошибка: Пользователь не авторизован.', status: 'error' };

    const { error: upsertError } = await supabase.from('users').upsert({ id: user.id });
    if (upsertError) {
        return { message: `Ошибка синхронизации профиля: ${upsertError.message}`, status: 'error' };
    }

    // START_TIMESTAMP_CONSTRUCTION_BLOCK: [Создание полного timestamp из текущей даты и времени из формы.]
    const [hours, minutes] = validatedFields.data.time.split(':').map(Number);
    const loggedAt = new Date();
    loggedAt.setHours(hours, minutes, 0, 0);
    // END_TIMESTAMP_CONSTRUCTION_BLOCK

    const { error } = await supabase.from('food_log').insert({
        user_id: user.id,
        product_id: validatedFields.data.productId,
        weight_g: validatedFields.data.weight,
        meal_type: validatedFields.data.mealType,
        logged_at: loggedAt.toISOString(),
    });

    if (error) {
        return { message: `Ошибка базы данных: ${error.message}`, status: 'error' };
    }

    revalidatePath('/dashboard');
    return { message: `Прием пищи успешно записан!`, status: 'success' };
}
// END_SERVER_ACTION_addFoodLog


// START_TYPE_DEFINITION_NutritionSummary
// CONTRACT:
// PURPOSE: [Определяет структуру объекта с итоговыми данными по питанию за день.]
export type NutritionSummary = {
    total_calories: number;
    total_protein: number;
    total_fat: number;
    total_carbs: number;
};
// END_TYPE_DEFINITION_NutritionSummary


// START_SERVER_ACTION_getDailyNutritionSummary
// CONTRACT:
// PURPOSE: [Извлекает все записи о приемах пищи за текущий день и рассчитывает
//           итоговую сумму калорий, белков, жиров и углеводов.]
// OUTPUTS:
//   - Promise<NutritionSummary> - Объект с итоговыми данными по питанию.
export async function getDailyNutritionSummary(): Promise<NutritionSummary> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return { total_calories: 0, total_protein: 0, total_fat: 0, total_carbs: 0 };

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const { data: meals, error } = await supabase
        .from('meals')
        .select(`
            food_log(
                weight_g,
                products(*),
                recipes(recipe_products(weight_grams, products(*)))
            )
        `)
        .eq('user_id', user.id)
        .gte('logged_at', today.toISOString())
        .lt('logged_at', tomorrow.toISOString());

    if (error) {
        console.error("Database Error:", error.message);
        throw new Error("Failed to fetch nutrition data.");
    }

    const summary: NutritionSummary = {
        total_calories: 0,
        total_protein: 0,
        total_fat: 0,
        total_carbs: 0,
    };

    if (meals) {
        for (const meal of meals) {
            for (const log of meal.food_log) {
                if (log.products) {
                    const product = log.products as unknown as Product;
                    const ratio = (log.weight_g || 0) / 100;
                    summary.total_calories += product.calories_per_100g * ratio;
                    summary.total_protein += product.protein_per_100g * ratio;
                    summary.total_fat += product.fat_per_100g * ratio;
                    summary.total_carbs += product.carbs_per_100g * ratio;
                } else if (log.recipes) {
                    const recipe = log.recipes as any;
                    for (const item of recipe.recipe_products) {
                        const product = item.products as unknown as Product;
                        const ratio = item.weight_grams / 100;
                        summary.total_calories += product.calories_per_100g * ratio;
                        summary.total_protein += product.protein_per_100g * ratio;
                        summary.total_fat += product.fat_per_100g * ratio;
                        summary.total_carbs += product.carbs_per_100g * ratio;
                    }
                }
            }
        }
    }
    
    return summary;
}
// END_SERVER_ACTION_getDailyNutritionSummary


// START_SERVER_ACTION_deleteProduct
// CONTRACT:
// PURPOSE: [Удаляет продукт из справочника пользователя по его ID.]
// INPUTS:
//   - productId: string - ID продукта, который необходимо удалить.
// SIDE_EFFECTS:
//   - Удаляет запись из таблицы 'products' в Supabase.
//   - Вызывает revalidatePath для обновления UI.
export async function deleteProduct(productId: string) {
    // START_VALIDATION_BLOCK: [Проверка наличия ID продукта.]
    if (!productId) {
        return { message: 'Ошибка: ID продукта не предоставлен.', status: 'error' };
    }
    // END_VALIDATION_BLOCK

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Ошибка: Пользователь не авторизован.', status: 'error' };
    }

    // START_DB_DELETE_BLOCK: [Удаление продукта из базы данных.]
    const { error } = await supabase
        .from('products')
        .delete()
        .match({ id: productId, user_id: user.id });

    if (error) {
        return { message: `Ошибка базы данных: ${error.message}`, status: 'error' };
    }
    // END_DB_DELETE_BLOCK

    revalidatePath('/dashboard/products');
    return { message: 'Продукт успешно удален.', status: 'success' };
}
// END_SERVER_ACTION_deleteProduct

// START_SERVER_ACTION_updateProduct
// CONTRACT:
// PURPOSE: [Обрабатывает отправку формы для обновления существующего продукта.]
// INPUTS:
//   - productId: string - ID продукта для обновления.
//   - previousState: FormState - Предыдущее состояние формы.
//   - formData: FormData - Данные, отправленные из формы.
// OUTPUTS:
//   - FormState - Новое состояние формы с сообщением об успехе или ошибке.
// SIDE_EFFECTS:
//   - Обновляет запись в таблице 'products' в Supabase.
//   - Вызывает revalidatePath для обновления UI.
export async function updateProduct(productId: string, previousState: FormState, formData: FormData): Promise<FormState> {
    // START_VALIDATION_BLOCK: [Валидация входящих данных формы с помощью Zod.]
    if (!productId) {
        return { message: 'Ошибка: ID продукта не предоставлен.', status: 'error' };
    }

    const validatedFields = addProductSchema.safeParse({
        name: formData.get('name'),
        calories: formData.get('calories'),
        protein: formData.get('protein'),
        fat: formData.get('fat'),
        carbs: formData.get('carbs'),
        fiber: formData.get('fiber'),
        sugar: formData.get('sugar'),
        alcohol: formData.get('alcohol'),
        caffeine: formData.get('caffeine'),
    });

    if (!validatedFields.success) {
        return {
            message: 'Ошибка валидации. Пожалуйста, проверьте введенные данные.',
            errors: validatedFields.error.flatten().fieldErrors,
            status: 'error',
        };
    }
    // END_VALIDATION_BLOCK

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
        return { message: 'Ошибка: Пользователь не авторизован.', status: 'error' };
    }

    // START_DB_UPDATE_BLOCK: [Обновление данных продукта в базе данных.]
    const { error } = await supabase
        .from('products')
        .update({
            name: validatedFields.data.name,
            calories_per_100g: validatedFields.data.calories,
            protein_per_100g: validatedFields.data.protein,
            fat_per_100g: validatedFields.data.fat,
            carbs_per_100g: validatedFields.data.carbs,
            fiber_per_100g: validatedFields.data.fiber || 0,
            sugar_per_100g: validatedFields.data.sugar || 0,
            alcohol_per_100g: validatedFields.data.alcohol || 0,
            caffeine_per_100g_mg: validatedFields.data.caffeine || 0,
        })
        .match({ id: productId, user_id: user.id });

    if (error) {
        return { message: `Ошибка базы данных: ${error.message}`, status: 'error' };
    }
    // END_DB_UPDATE_BLOCK

    revalidatePath('/dashboard/products');
    return { message: `Продукт "${validatedFields.data.name}" успешно обновлен!`, status: 'success' };
}
// END_SERVER_ACTION_updateProduct


// START_TYPE_DEFINITION_Recipe
// CONTRACT:
// PURPOSE: [Определяет структуру объекта рецепта для использования в UI.]
export type Recipe = {
    id: string;
    name: string;
    total_calories: number;
    total_protein: number;
    total_fat: number;
    total_carbs: number;
};
// END_TYPE_DEFINITION_Recipe

// START_SERVER_ACTION_getRecipes
// CONTRACT:
// PURPOSE: [Извлекает список всех рецептов, созданных текущим пользователем, с возможностью фильтрации по названию.]
// INPUTS:
//   - query: string (optional) - Строка для поиска по названию рецепта.
// OUTPUTS:
//   - Promise<Recipe[]> - Массив объектов рецептов.
export async function getRecipes(query?: string): Promise<Recipe[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // START_BASE_RECIPE_FETCH_BLOCK: [Получение базового списка рецептов с фильтрацией.]
    let recipeQuery = supabase
        .from('recipes')
        .select('id, name')
        .eq('user_id', user.id);

    if (query) {
        recipeQuery = recipeQuery.ilike('name', `%${query}%`);
    }

    const { data: recipes, error: recipesError } = await recipeQuery.order('name', { ascending: true });

    if (recipesError) {
        console.error('Database Error fetching recipes:', recipesError.message);
        throw new Error('Не удалось загрузить рецепты.');
    }
    // END_BASE_RECIPE_FETCH_BLOCK

    // START_NUTRITION_CALCULATION_BLOCK: [Расчет КБЖУ для каждого рецепта.]
    const recipeIds = recipes.map(r => r.id);
    if (recipeIds.length === 0) return [];

    const { data: ingredients, error: ingredientsError } = await supabase
        .from('recipe_products')
        .select(`
            recipe_id,
            weight_grams,
            products (
                calories_per_100g,
                protein_per_100g,
                fat_per_100g,
                carbs_per_100g
            )
        `)
        .in('recipe_id', recipeIds);

    if (ingredientsError) {
        console.error('Database Error fetching ingredients:', ingredientsError.message);
        throw new Error('Не удалось загрузить ингредиенты для расчета.');
    }

    const nutritionMap = new Map<string, Omit<Recipe, 'id' | 'name' | 'created_at'>>();

    for (const ingredient of ingredients) {
        if (!ingredient.products) continue;

        const recipeId = ingredient.recipe_id;
        const product = ingredient.products as unknown as Product; // Type assertion
        const ratio = ingredient.weight_grams / 100;

        const current = nutritionMap.get(recipeId) || {
            total_calories: 0,
            total_protein: 0,
            total_fat: 0,
            total_carbs: 0,
        };

        current.total_calories += product.calories_per_100g * ratio;
        current.total_protein += product.protein_per_100g * ratio;
        current.total_fat += product.fat_per_100g * ratio;
        current.total_carbs += product.carbs_per_100g * ratio;

        nutritionMap.set(recipeId, current);
    }

    const recipesWithNutrition: Recipe[] = recipes.map(recipe => {
        const nutrition = nutritionMap.get(recipe.id) || {
            total_calories: 0,
            total_protein: 0,
            total_fat: 0,
            total_carbs: 0,
        };
        return {
            ...recipe,
            ...nutrition,
        };
    });
    // END_NUTRITION_CALCULATION_BLOCK
    
    return recipesWithNutrition;
}
// END_SERVER_ACTION_getRecipes


// START_SERVER_ACTION_addRecipe
// CONTRACT:
// PURPOSE: [Обрабатывает отправку формы для добавления нового рецепта в личный справочник пользователя.]
// INPUTS:
//   - previousState: FormState - Предыдущее состояние формы (для useFormState).
//   - formData: FormData - Данные, отправленные из HTML-формы.
// OUTPUTS:
//   - FormState - Новое состояние формы с сообщением об успехе или ошибке.
// SIDE_EFFECTS:
//   - Вставляет новую запись в таблицу 'recipes' в Supabase.
//   - Вызывает revalidatePath('/dashboard/recipes') для обновления UI.
export async function addRecipe(previousState: FormState, formData: FormData): Promise<FormState> {
    // START_DATA_TRANSFORMATION_BLOCK: [Преобразование данных формы в структурированный объект.]
    const rawData: { name: string; ingredients: { productId: string; weight: string }[] } = {
        name: formData.get('name') as string,
        ingredients: [],
    };

    formData.forEach((value, key) => {
        const match = key.match(/ingredients\[(\d+)\]\[(productId|weight)\]/);
        if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
            if (!rawData.ingredients[index]) {
                rawData.ingredients[index] = { productId: '', weight: '' };
            }
            (rawData.ingredients[index] as any)[field] = value;
        }
    });
    // END_DATA_TRANSFORMATION_BLOCK

    // START_VALIDATION_BLOCK: [Валидация входящих данных формы с помощью Zod.]
    const validatedFields = addRecipeSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.log(validatedFields.error.flatten().fieldErrors);
        return {
            message: 'Ошибка валидации. Пожалуйста, проверьте введенные данные.',
            errors: validatedFields.error.flatten().fieldErrors,
            status: 'error',
        };
    }
    // END_VALIDATION_BLOCK

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Ошибка: Пользователь не авторизован.', status: 'error' };
    }

    // START_TRANSACTION_BLOCK: [Вставка рецепта и его ингредиентов в рамках одной транзакции.]
    // 1. Insert the recipe
    const { data: recipeData, error: recipeError } = await supabase
        .from('recipes')
        .insert({
            user_id: user.id,
            name: validatedFields.data.name,
        })
        .select('id')
        .single();

    if (recipeError) {
        return { message: `Ошибка базы данных при создании рецепта: ${recipeError.message}`, status: 'error' };
    }

    const recipeId = recipeData.id;

    // 2. Prepare and insert ingredients if they exist
    if (validatedFields.data.ingredients && validatedFields.data.ingredients.length > 0) {
        const ingredientsToInsert = validatedFields.data.ingredients.map(ing => ({
            recipe_id: recipeId,
            product_id: ing.productId,
            weight_grams: ing.weight,
            user_id: user.id,
        }));

        const { error: ingredientsError } = await supabase
            .from('recipe_products')
            .insert(ingredientsToInsert);

        if (ingredientsError) {
            // Attempt to roll back the recipe creation if ingredients fail
            await supabase.from('recipes').delete().match({ id: recipeId });
            return { message: `Ошибка базы данных при добавлении ингредиентов: ${ingredientsError.message}`, status: 'error' };
        }
    }
    // END_TRANSACTION_BLOCK

    revalidatePath('/dashboard/recipes');
    return { message: `Рецепт "${validatedFields.data.name}" успешно добавлен!`, status: 'success' };
}
// END_SERVER_ACTION_addRecipe


// START_SERVER_ACTION_deleteRecipe
// CONTRACT:
// PURPOSE: [Удаляет рецепт и все связанные с ним ингредиенты.]
// INPUTS:
//   - recipeId: string - ID рецепта для удаления.
// SIDE_EFFECTS:
//   - Удаляет запись из таблицы 'recipes'. Связанные записи в 'recipe_products' удаляются каскадно.
//   - Вызывает revalidatePath для обновления UI.
export async function deleteRecipe(recipeId: string) {
    // START_VALIDATION_BLOCK: [Проверка наличия ID рецепта.]
    if (!recipeId) {
        return { message: 'Ошибка: ID рецепта не предоставлен.', status: 'error' };
    }
    // END_VALIDATION_BLOCK

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Ошибка: Пользователь не авторизован.', status: 'error' };
    }

    // START_DB_DELETE_BLOCK: [Удаление рецепта из базы данных. Ингредиенты удаляются каскадно.]
    const { error } = await supabase
        .from('recipes')
        .delete()
        .match({ id: recipeId, user_id: user.id });

    if (error) {
        return { message: `Ошибка базы данных: ${error.message}`, status: 'error' };
    }
    // END_DB_DELETE_BLOCK

    revalidatePath('/dashboard/recipes');
    return { message: 'Рецепт успешно удален.', status: 'success' };
}
// END_SERVER_ACTION_deleteRecipe


// START_SERVER_ACTION_updateRecipe
// CONTRACT:
// PURPOSE: [Обновляет существующий рецепт и его состав.]
// INPUTS:
//   - recipeId: string - ID рецепта для обновления.
//   - previousState: FormState - Предыдущее состояние формы.
//   - formData: FormData - Данные, отправленные из формы.
// SIDE_EFFECTS:
//   - Обновляет запись в 'recipes' и перезаписывает связанные ингредиенты в 'recipe_products'.
//   - Вызывает revalidatePath для обновления UI.
export async function updateRecipe(recipeId: string, previousState: FormState, formData: FormData): Promise<FormState> {
    if (!recipeId) {
        return { message: 'Ошибка: ID рецепта не предоставлен.', status: 'error' };
    }

    // START_DATA_TRANSFORMATION_BLOCK: [Преобразование данных формы в структурированный объект.]
    const rawData: { name: string; ingredients: { productId: string; weight: string }[] } = {
        name: formData.get('name') as string,
        ingredients: [],
    };

    formData.forEach((value, key) => {
        const match = key.match(/ingredients\[(\d+)\]\[(productId|weight)\]/);
        if (match) {
            const index = parseInt(match[1], 10);
            const field = match[2];
            if (!rawData.ingredients[index]) {
                rawData.ingredients[index] = { productId: '', weight: '' };
            }
            (rawData.ingredients[index] as any)[field] = value;
        }
    });
    // END_DATA_TRANSFORMATION_BLOCK

    // START_VALIDATION_BLOCK: [Валидация входящих данных формы с помощью Zod.]
    const validatedFields = addRecipeSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            message: 'Ошибка валидации. Пожалуйста, проверьте введенные данные.',
            errors: validatedFields.error.flatten().fieldErrors,
            status: 'error',
        };
    }
    // END_VALIDATION_BLOCK

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Ошибка: Пользователь не авторизован.', status: 'error' };
    }

    // START_TRANSACTION_BLOCK: [Обновление рецепта и его ингредиентов.]
    // 1. Update the recipe name
    const { error: recipeError } = await supabase
        .from('recipes')
        .update({ name: validatedFields.data.name })
        .match({ id: recipeId, user_id: user.id });

    if (recipeError) {
        return { message: `Ошибка базы данных при обновлении рецепта: ${recipeError.message}`, status: 'error' };
    }

    // 2. Delete old ingredients
    const { error: deleteError } = await supabase
        .from('recipe_products')
        .delete()
        .match({ recipe_id: recipeId, user_id: user.id });

    if (deleteError) {
        return { message: `Ошибка базы данных при удалении старых ингредиентов: ${deleteError.message}`, status: 'error' };
    }

    // 3. Insert new ingredients if they exist
    if (validatedFields.data.ingredients && validatedFields.data.ingredients.length > 0) {
        const ingredientsToInsert = validatedFields.data.ingredients
            .filter(ing => ing.productId && ing.weight > 0) // Ensure ingredients are valid
            .map(ing => ({
                recipe_id: recipeId,
                product_id: ing.productId,
                weight_grams: ing.weight,
                user_id: user.id,
            }));

        if (ingredientsToInsert.length > 0) {
            const { error: ingredientsError } = await supabase
                .from('recipe_products')
                .insert(ingredientsToInsert);

            if (ingredientsError) {
                return { message: `Ошибка базы данных при добавлении новых ингредиентов: ${ingredientsError.message}`, status: 'error' };
            }
        }
    }
    // END_TRANSACTION_BLOCK

    revalidatePath('/dashboard/recipes');
    return { message: `Рецепт "${validatedFields.data.name}" успешно обновлен!`, status: 'success' };
}
// END_SERVER_ACTION_updateRecipe


// START_TYPE_DEFINITION_RecipeIngredient
// CONTRACT:
// PURPOSE: [Определяет структуру объекта ингредиента рецепта.]
export type RecipeIngredient = {
    product_id: string;
    weight_grams: number;
};
// END_TYPE_DEFINITION_RecipeIngredient


// START_SERVER_ACTION_getRecipeIngredients
// CONTRACT:
// PURPOSE: [Извлекает список ингредиентов для конкретного рецепта.]
// INPUTS:
//   - recipeId: string - ID рецепта.
// OUTPUTS:
//   - Promise<RecipeIngredient[]> - Массив объектов ингредиентов.
export async function getRecipeIngredients(recipeId: string): Promise<RecipeIngredient[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    const { data, error } = await supabase
        .from('recipe_products')
        .select('product_id, weight_grams')
        .eq('recipe_id', recipeId)
        .eq('user_id', user.id);

    if (error) {
        console.error('Database Error:', error.message);
        throw new Error('Не удалось загрузить ингредиенты рецепта.');
    }
    
    return data;
}
// END_SERVER_ACTION_getRecipeIngredients


// START_TYPE_DEFINITION_FoodSearchResult
// CONTRACT:
// PURPOSE: [Определяет структуру объекта для результатов поиска продуктов и рецептов.]
export type FoodSearchResult = {
    id: string;
    name: string;
    type: 'product' | 'recipe';
};
// END_TYPE_DEFINITION_FoodSearchResult


// START_SERVER_ACTION_searchFoodItems
// CONTRACT:
// PURPOSE: [Выполняет поиск по продуктам и рецептам пользователя по заданной строке.]
// INPUTS:
//   - query: string - Поисковый запрос.
// OUTPUTS:
//   - Promise<FoodSearchResult[]> - Массив объектов, содержащих продукты и рецепты.
export async function searchFoodItems(query: string): Promise<FoodSearchResult[]> {
    if (!query) return [];

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // START_PRODUCT_SEARCH_BLOCK: [Поиск по таблице продуктов.]
    const { data: products, error: productError } = await supabase
        .from('products')
        .select('id, name')
        .eq('user_id', user.id)
        .ilike('name', `%${query}%`)
        .limit(5);

    if (productError) {
        console.error('Product search error:', productError.message);
        throw new Error('Не удалось выполнить поиск по продуктам.');
    }
    // END_PRODUCT_SEARCH_BLOCK

    // START_RECIPE_SEARCH_BLOCK: [Поиск по таблице рецептов.]
    const { data: recipes, error: recipeError } = await supabase
        .from('recipes')
        .select('id, name')
        .eq('user_id', user.id)
        .ilike('name', `%${query}%`)
        .limit(5);

    if (recipeError) {
        console.error('Recipe search error:', recipeError.message);
        throw new Error('Не удалось выполнить поиск по рецептам.');
    }
    // END_RECIPE_SEARCH_BLOCK

    // START_COMBINE_RESULTS_BLOCK: [Объединение и форматирование результатов поиска.]
    const productResults: FoodSearchResult[] = products.map(p => ({ ...p, type: 'product' }));
    const recipeResults: FoodSearchResult[] = recipes.map(r => ({ ...r, type: 'recipe' }));

    const combinedResults = [...productResults, ...recipeResults].sort((a, b) => a.name.localeCompare(b.name));
    // END_COMBINE_RESULTS_BLOCK

    return combinedResults;
}
// END_SERVER_ACTION_searchFoodItems


// START_SERVER_ACTION_addMeal
// CONTRACT:
// PURPOSE: [Обрабатывает создание нового приема пищи и всех связанных с ним записей в журнале еды.]
// INPUTS:
//   - previousState: FormState - Предыдущее состояние формы.
//   - formData: FormData - Данные, отправленные из формы.
// OUTPUTS:
//   - FormState - Новое состояние формы с сообщением об успехе или ошибке.
// SIDE_EFFECTS:
//   - Создает одну запись в таблице 'meals'.
//   - Создает одну или несколько записей в таблице 'food_log'.
//   - Вызывает revalidatePath для обновления UI.
export async function addMeal(previousState: FormState, formData: FormData): Promise<FormState> {
    
    // START_DATA_TRANSFORMATION_BLOCK: [Преобразование данных формы в структурированный объект.]
    const rawData = {
        mealType: formData.get('mealType'),
        loggedAt: formData.get('loggedAt'),
        items: JSON.parse(formData.get('items') as string || '[]'),
    };
    // END_DATA_TRANSFORMATION_BLOCK

    // START_VALIDATION_BLOCK: [Валидация входящих данных формы с помощью Zod.]
    const validatedFields = addMealSchema.safeParse(rawData);

    if (!validatedFields.success) {
        console.error('Validation Errors:', validatedFields.error.flatten().fieldErrors);
        return {
            message: 'Ошибка валидации. Пожалуйста, проверьте введенные данные.',
            errors: validatedFields.error.flatten().fieldErrors,
            status: 'error',
        };
    }
    // END_VALIDATION_BLOCK

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Ошибка: Пользователь не авторизован.', status: 'error' };
    }

    // START_TRANSACTION_BLOCK: [Вставка приема пищи и всех его составляющих.]
    // 1. Create the meal entry
    const { data: mealData, error: mealError } = await supabase
        .from('meals')
        .insert({
            user_id: user.id,
            meal_type: validatedFields.data.mealType,
            logged_at: validatedFields.data.loggedAt,
        })
        .select('id')
        .single();

    if (mealError) {
        return { message: `Ошибка базы данных при создании приема пищи: ${mealError.message}`, status: 'error' };
    }

    const mealId = mealData.id;

    // 2. Prepare food_log entries
    const foodLogEntries = validatedFields.data.items.map(item => ({
        user_id: user.id,
        meal_id: mealId,
        product_id: item.type === 'product' ? item.id : null,
        recipe_id: item.type === 'recipe' ? item.id : null,
        weight_g: item.weight, // Will be null for recipes, which is correct
    }));

    // 3. Insert all food_log entries
    const { error: foodLogError } = await supabase
        .from('food_log')
        .insert(foodLogEntries);

    if (foodLogError) {
        // Attempt to roll back the meal creation if food_log entries fail
        await supabase.from('meals').delete().match({ id: mealId });
        return { message: `Ошибка базы данных при записи еды: ${foodLogError.message}`, status: 'error' };
    }
    // END_TRANSACTION_BLOCK

    revalidatePath('/dashboard'); // Revalidate the main dashboard to update summary widgets
    revalidatePath('/dashboard/nutrition'); // Revalidate the nutrition page
    return { message: 'Прием пищи успешно добавлен!', status: 'success' };
}
// END_SERVER_ACTION_addMeal


// START_TYPE_DEFINITION_Meal
// CONTRACT:
// PURPOSE: [Определяет полную структуру приема пищи, включая вложенные продукты, рецепты и рассчитанный КБЖУ.]
export type Meal = {
    id: string;
    meal_type: string;
    logged_at: string;
    total_calories: number;
    total_protein: number;
    total_fat: number;
    total_carbs: number;
    food_log: {
        id: string;
        weight_g: number | null;
        products: {
            id: string;
            name: string;
        } | null;
        recipes: {
            id: string;
            name: string;
        } | null;
    }[];
};
// END_TYPE_DEFINITION_Meal


// START_SERVER_ACTION_getMealsForDate
// CONTRACT:
// PURPOSE: [Извлекает все приемы пищи и их содержимое за указанную дату, рассчитывая КБЖУ для каждого приема пищи.]
// INPUTS:
//   - date: Date - Дата, за которую нужно получить данные.
// OUTPUTS:
//   - Promise<Meal[]> - Массив объектов приемов пищи с рассчитанным КБЖУ.
export async function getMealsForDate(date: Date): Promise<Meal[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // START_DATE_RANGE_SETUP: [Определение начальной и конечной временных меток для запроса.]
    const startDate = new Date(date);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate);
    endDate.setDate(endDate.getDate() + 1);
    // END_DATE_RANGE_SETUP

    // START_DB_FETCH_BLOCK: [Выборка данных о приемах пищи с полными данными по продуктам и рецептам.]
    const { data, error } = await supabase
        .from('meals')
        .select(`
            id,
            meal_type,
            logged_at,
            food_log (
                id,
                weight_g,
                products(*),
                recipes(
                    id, name,
                    recipe_products(
                        weight_grams,
                        products(*)
                    )
                )
            )
        `)
        .eq('user_id', user.id)
        .gte('logged_at', startDate.toISOString())
        .lt('logged_at', endDate.toISOString())
        .order('logged_at', { ascending: true });

    if (error) {
        console.error('Error fetching meals:', error.message);
        throw new Error('Не удалось загрузить приемы пищи.');
    }
    // END_DB_FETCH_BLOCK

    // START_CALCULATION_BLOCK: [Расчет КБЖУ для каждого приема пищи на сервере.]
    const mealsWithNutrition = data.map(meal => {
        const mealSummary = {
            total_calories: 0,
            total_protein: 0,
            total_fat: 0,
            total_carbs: 0,
        };

        for (const log of meal.food_log) {
            if (log.products) {
                const product = log.products as unknown as Product;
                const ratio = (log.weight_g || 0) / 100;
                mealSummary.total_calories += (product.calories_per_100g || 0) * ratio;
                mealSummary.total_protein += (product.protein_per_100g || 0) * ratio;
                mealSummary.total_fat += (product.fat_per_100g || 0) * ratio;
                mealSummary.total_carbs += (product.carbs_per_100g || 0) * ratio;
            } else if (log.recipes) {
                const recipe = log.recipes as any;
                for (const item of recipe.recipe_products) {
                    const product = item.products as unknown as Product;
                    const ratio = (item.weight_grams || 0) / 100;
                    mealSummary.total_calories += (product.calories_per_100g || 0) * ratio;
                    mealSummary.total_protein += (product.protein_per_100g || 0) * ratio;
                    mealSummary.total_fat += (product.fat_per_100g || 0) * ratio;
                    mealSummary.total_carbs += (product.carbs_per_100g || 0) * ratio;
                }
            }
        }
        
        return {
            ...meal,
            ...mealSummary,
        };
    });
    // END_CALCULATION_BLOCK

    return mealsWithNutrition as any as Meal[];
}
// END_SERVER_ACTION_getMealsForDate


// START_SERVER_ACTION_deleteMeal
// CONTRACT:
// PURPOSE: [Удаляет прием пищи и все связанные с ним записи в журнале еды.]
// INPUTS:
//   - mealId: string - ID приема пищи для удаления.
// SIDE_EFFECTS:
//   - Удаляет запись из таблицы 'meals'. Связанные записи в 'food_log' удаляются каскадно.
//   - Вызывает revalidatePath для обновления UI.
export async function deleteMeal(mealId: string) {
    if (!mealId) {
        return { message: 'Ошибка: ID приема пищи не предоставлен.', status: 'error' };
    }

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
        return { message: 'Ошибка: Пользователь не авторизован.', status: 'error' };
    }

    const { error } = await supabase
        .from('meals')
        .delete()
        .match({ id: mealId, user_id: user.id });

    if (error) {
        return { message: `Ошибка базы данных: ${error.message}`, status: 'error' };
    }

    revalidatePath('/dashboard/nutrition');
    revalidatePath('/dashboard');
    return { message: 'Прием пищи успешно удален.', status: 'success' };
}
// END_SERVER_ACTION_deleteMeal


// START_TYPE_DEFINITION_NutritionDataPoint
// CONTRACT:
// PURPOSE: [Определяет структуру точки данных для графика истории питания.]
export type NutritionDataPoint = {
    date: string;
    calories: number;
    protein: number;
    fat: number;
    carbs: number;
};
// END_TYPE_DEFINITION_NutritionDataPoint


// START_SERVER_ACTION_getNutritionHistory
// CONTRACT:
// PURPOSE: [Агрегирует данные по КБЖУ за заданный период времени, группируя по дням.]
// INPUTS:
//   - from: Date - Начальная дата периода.
//   - to: Date - Конечная дата периода.
// OUTPUTS:
//   - Promise<NutritionDataPoint[]> - Массив точек данных для графика.
export async function getNutritionHistory(from: Date, to: Date): Promise<NutritionDataPoint[]> {
    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return [];

    // START_DB_FETCH_BLOCK: [Выборка всех записей журнала еды за заданный период.]
    const { data, error } = await supabase
        .from('food_log')
        .select(`
            weight_g,
            logged_at,
            products (calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g),
            recipes (recipe_products(weight_grams, products(calories_per_100g, protein_per_100g, fat_per_100g, carbs_per_100g)))
        `)
        .eq('user_id', user.id)
        .gte('logged_at', from.toISOString())
        .lt('logged_at', to.toISOString());

    if (error) {
        console.error('Error fetching nutrition history:', error.message);
        throw new Error('Не удалось загрузить историю питания.');
    }
    // END_DB_FETCH_BLOCK

    // START_DATA_AGGREGATION_BLOCK: [Агрегация данных по дням.]
    const dailyTotals: { [key: string]: Omit<NutritionDataPoint, 'date'> } = {};

    for (const log of data) {
        const date = new Date(log.logged_at).toISOString().split('T')[0];
        if (!dailyTotals[date]) {
            dailyTotals[date] = { calories: 0, protein: 0, fat: 0, carbs: 0 };
        }

        if (log.products) {
            const product = log.products as unknown as Product;
            const ratio = (log.weight_g || 0) / 100;
            dailyTotals[date].calories += product.calories_per_100g * ratio;
            dailyTotals[date].protein += product.protein_per_100g * ratio;
            dailyTotals[date].fat += product.fat_per_100g * ratio;
            dailyTotals[date].carbs += product.carbs_per_100g * ratio;
        } else if (log.recipes) {
            const recipe = log.recipes as any;
            for (const item of recipe.recipe_products) {
                const product = item.products as unknown as Product;
                const ratio = item.weight_grams / 100;
                dailyTotals[date].calories += product.calories_per_100g * ratio;
                dailyTotals[date].protein += product.protein_per_100g * ratio;
                dailyTotals[date].fat += product.fat_per_100g * ratio;
                dailyTotals[date].carbs += product.carbs_per_100g * ratio;
            }
        }
    }

    const result: NutritionDataPoint[] = Object.entries(dailyTotals).map(([date, totals]) => ({
        date,
        ...totals,
    })).sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
    // END_DATA_AGGREGATION_BLOCK

    return result;
}
// END_SERVER_ACTION_getNutritionHistory
