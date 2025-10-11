'use client';

import { deleteMeal } from '../../app/actions';

// MODULE_CONTRACT:
// PURPOSE: [Кнопка для удаления приема пищи с подтверждением.]
// SCOPE: [UI, Мутации данных]
// KEYWORDS_MODULE: [ui, button, delete, meal]

export function DeleteMealButton({ id }: { id: string }) {
  const deleteMealWithId = async () => {
    if (confirm('Вы уверены, что хотите удалить этот прием пищи?')) {
      await deleteMeal(id);
    }
  };

  return (
    <form action={deleteMealWithId}>
      <button type="submit" className="text-red-500 hover:text-red-700">
        Удалить
      </button>
    </form>
  );
}