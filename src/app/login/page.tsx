// MODULE_CONTRACT:
// PURPOSE: [Отображает страницу входа в систему для одного пользователя.
//           Обрабатывает ввод email/пароля и взаимодействие с Supabase Auth.]
// SCOPE: [Аутентификация, UI.]
// KEYWORDS_MODULE: [login, auth, ui, client-component, supabase]
// LINKS_TO_MODULE: [lib/supabase/client.ts] 
// LINKS_TO_SPECIFICATION: [Development Plan: Этап 1]

'use client'

import { createClient } from '../../../lib/supabase/client'; 
import { useRouter } from 'next/navigation';
import { useState } from 'react';

// START_COMPONENT_LoginPage
// CONTRACT:
// PURPOSE: [Основной компонент страницы входа. Управляет состоянием формы,
//           обрабатывает отправку данных и отображает сообщения об ошибках.]
export default function LoginPage() {
    // START_STATE_MANAGEMENT: [Управление состоянием формы и ошибок.]
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const supabase = createClient();
    // END_STATE_MANAGEMENT

    // START_SIGN_IN_HANDLER: [Обработчик для входа пользователя.]
    const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        const { error } = await supabase.auth.signInWithPassword({
            email,
            password,
        });

        if (error) {
            setError(error.message);
        } else {
            // Перенаправляем на дашборд и перезагружаем страницу для обновления сессии
            router.push('/dashboard');
            router.refresh();
        }
        setLoading(false);
    };
    // END_SIGN_IN_HANDLER

    // START_RENDER_BLOCK: [Рендеринг JSX компонента формы входа.]
    return (
        <div className="flex items-center justify-center h-screen bg-gray-900">
            <div className="w-full max-w-md p-8 space-y-8 bg-gray-800 rounded-lg shadow-lg">
                <h2 className="text-2xl font-bold text-center text-white">
                    Sign In to Your Account
                </h2>
                <form className="space-y-6" onSubmit={handleSignIn}>
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-300"
                        >
                            Password
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 mt-1 text-white bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 font-semibold text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-blue-500 disabled:opacity-50"
                    >
                        {loading ? 'Signing In...' : 'Sign In'}
                    </button>
                    {error && (
                        <p className="mt-4 text-sm text-center text-red-400">
                            {error}
                        </p>
                    )}
                </form>
            </div>
        </div>
    );
    // END_RENDER_BLOCK
}
// END_COMPONENT_LoginPage

