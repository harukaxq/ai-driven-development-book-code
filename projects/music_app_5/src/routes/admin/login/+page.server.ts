import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';
import { SECRET_KEY } from '$env/static/private';

export const actions = {
    default: async ({ request, cookies }) => {
        const data = await request.formData();
        const key = data.get('key');

        if (key !== SECRET_KEY) {
            throw redirect(303, `/admin/login?error=${encodeURIComponent('Unauthorized: Invalid secret key')}`);
        }

        // JWTトークンを生成
        const token = jwt.sign({ user: 'admin' }, SECRET_KEY, { expiresIn: '1d' });

        // 認証成功時にクッキーを設定
        cookies.set('auth', token, {
            path: '/admin',
            httpOnly: true,
            secure: true,
            maxAge: 60 * 60 * 24
        });

        throw redirect(303, '/admin'); // 成功時にリダイレクト
    }
};