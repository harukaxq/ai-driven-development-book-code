import { SECRET_KEY } from '$env/static/private';
import { redirect } from '@sveltejs/kit';
import jwt from 'jsonwebtoken';

const adminPath = '/admin';
const loginPath = '/admin/login';

export const handle = async ({ event, resolve }) => {
  const url = new URL(event.request.url);
  const isAdminPath = url.pathname.startsWith(adminPath) && url.pathname !== loginPath;
  const isLoginPath = url.pathname === loginPath;
  if (isLoginPath || !isAdminPath) {
    return resolve(event);
  }

  const token = event.cookies.get('auth');

  if (isAdminPath && !token) {
    throw redirect(302, '/admin/login');
  }

  try {
    jwt.verify(token, SECRET_KEY);
  } catch (err) {
    throw redirect(302, '/admin/login');
  }

  return resolve(event);
};