# Техническое Задание (ТЗ)

## 1. Пользовательский Интерфейс (UI)

### FR-UI-DASH-001: Главная Панель Управления (Дашборд)

- **Требование:** Отображение сводной информации по ключевым показателям за выбранный день.
    
- **Описание:** Dark mode, левый сайдбар для навигации, основная область с сеткой виджетов (питание, активность, сон). Заголовок с выбором даты и кнопкой "Добавить запись".
    

### FR-UI-ENTRY-002: Интерфейс Ввода Данных

- **Требование:** Унифицированный интерфейс для добавления записей через модальное окно.
    
- **Описание:** Вызывается по кнопке "Добавить запись". Сначала пользователь выбирает тип данных (Еда, Тренировка), затем появляется динамическая форма с полями, соответствующими выбранному типу.
    

### FR-UI-HIST-003: Просмотр Истории и Аналитики

- **Требование:** Возможность просматривать динамику любого показателя во времени.
    
- **Описание:** Отдельный раздел с интерактивным графиком. Пользователь может выбрать показатель и период для анализа. Под графиком — детальный журнал записей.
    

## 2. Структура Данных (Схема Базы Данных)

### DB-SCHEMA-001: Таблицы PostgreSQL

- **`users`**: Профили пользователей.
    
    - `id`: `uuid` (Primary Key, связь с `auth.users`)
        
    - `height_cm`: `integer` (Рост для расчета ИМТ)
        
    - `date_of_birth`: `date` (Дата рождения)
        
- **`products`**: Справочник продуктов питания пользователя.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `name`: `text` (Название продукта)
        
    - `calories_per_100g`: `numeric` (Калории на 100г)
        
    - `protein_per_100g`: `numeric` (Белки на 100г)
        
    - `fat_per_100g`: `numeric` (Жиры на 100г)
        
    - `carbs_per_100g`: `numeric` (Углеводы на 100г)
        
    - `fiber_per_100g`: `numeric` (Клетчатка на 100г)
        
    - `sugar_per_100g`: `numeric` (Сахар на 100г)
        
    - `alcohol_per_100g`: `numeric` (Алкоголь на 100г)
        
    - `caffeine_per_100g_mg`: `numeric` (Кофеин в мг на 100г)
        
    - `created_at`: `timestamp`
        
- **`food_log`**: Журнал приемов пищи.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `product_id`: `uuid` (Foreign Key to `products.id`)
        
    - `weight_g`: `integer` (Съеденный вес в граммах)
        
    - `meal_type`: `text` ('breakfast', 'lunch', 'dinner', 'snack')
        
    - `logged_at`: `timestamp` (Дата и время приема пищи)
        
- **`workouts`**: Журнал тренировок.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `type`: `text` ('Силовая', 'Кардио', 'Растяжка')
        
    - `name`: `text` (Название/уточнение, н-р, 'Тренировка ног')
        
    - `duration_minutes`: `integer` (Продолжительность в минутах)
        
    - `rpe`: `integer` (Оценка интенсивности от 1 до 10)
        
    - `distance_km`: `numeric` (Дистанция для кардио, nullable)
        
    - `started_at`: `timestamp` (Дата и время начала)
        
- **`workout_sets`**: Подходы в силовых тренировках.
    
    - `id`: `uuid` (Primary Key)
        
    - `workout_id`: `uuid` (Foreign Key to `workouts.id`)
        
    - `exercise_name`: `text` (Название упражнения)
        
    - `reps`: `integer` (Количество повторений)
        
    - `weight_kg`: `numeric` (Вес отягощения в кг)
        
- **`daily_metrics`**: Ежедневные показатели.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `date`: `date` (Дата, за которую вносятся показатели)
        
    - `steps`: `integer` (Количество шагов)
        
    - `water_ml`: `integer` (Выпито воды в мл)
        
    - `energy_level`: `integer` (Уровень энергии 1-10)
        
    - `mood_level`: `integer` (Настроение 1-10)
        
    - `stress_level`: `integer` (Стресс 1-10)
        
    - `digestion_quality`: `integer` (Качество пищеварения 1-10)
        
    - `notes`: `text` (Заметки/симптомы, nullable)
        
- **`sleep_log`**: Журнал сна.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `start_time`: `timestamp` (Время засыпания)
        
    - `end_time`: `timestamp` (Время пробуждения)
        
    - `quality_rating`: `integer` (Оценка качества 1-10)
        
    - `notes`: `text` (Заметки, nullable)
        
- **`supplements`**: Справочник добавок.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `name`: `text` (Название добавки)
        
    - `dose_per_unit`: `numeric` (Дозировка в одной единице)
        
    - `dose_units`: `text` ('мг', 'мкг', 'МЕ')
        
- **`supplement_log`**: Журнал приема добавок.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `supplement_id`: `uuid` (Foreign Key to `supplements.id`)
        
    - `total_dose`: `numeric` (Итоговая принятая доза)
        
    - `date`: `date` (Дата приема)
        
- **`body_measurements`**: Журнал измерений тела.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `date`: `date` (Дата измерения)
        
    - `weight_kg`: `numeric` (Вес в кг)
        
    - `body_fat_pct`: `numeric` (Процент жира, nullable)
        
    - `muscle_pct`: `numeric` (Процент мыщц, nullable)
        
- **`goals`**: Цели пользователя.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `name`: `text` (Название цели)
        
    - `linked_metric`: `text` (Ключ для связи с данными)
        
    - `start_value`: `numeric` (Начальное значение)
        
    - `target_value`: `numeric` (Целевое значение)
        
    - `target_date`: `date` (Желаемая дата достижения)
        
    - `status`: `text` ('Активна', 'Выполнена', 'Отменена')
        
- **`lab_reports`**: Отчеты по анализам.
    
    - `id`: `uuid` (Primary Key)
        
    - `user_id`: `uuid` (Foreign Key to `users.id`)
        
    - `report_date`: `date` (Дата сдачи анализов)
        
- **`lab_results`**: Результаты по маркерам.
    
    - `id`: `uuid` (Primary Key)
        
    - `report_id`: `uuid` (Foreign Key to `lab_reports.id`)
        
    - `marker_name`: `text` (Название биомаркера)
        
    - `value`: `numeric` (Значение)
        
    - `units`: `text` (Единицы измерения)
        
    - `reference_range`: `text` (Референтный диапазон, nullable)
        

_Все таблицы имеют `user_id` (или связаны через `report_id`) и настроены политики RLS для изоляции данных._

## 3. Функциональные Блоки

### FR-FUNC-BLOCKS-001: Детализация

- **FOOD_DATA_MANAGEMENT:** CRUD для справочника продуктов.
    
- **DAILY_LOGGING_ENGINE:** Запись всех событий в соответствующие таблицы БД.
    
- **DAILY_SUMMARY_CALCULATION:** Агрегация и расчет итоговых показателей за день для дашборда.
    
- **SUPPLEMENT_TRACKING_SYSTEM:** Управление справочником, схемами и журналом приема добавок.
    
- **HISTORICAL_DATA_ANALYSIS:** Извлечение данных для построения графиков.
    
- **GOAL_PROGRESS_TRACKING:** CRUD для целей и расчет прогресса.