import { NextResponse } from 'next/server';
import { withAuth } from 'next-auth/middleware';

// Configuration du middleware d'authentification
export default withAuth(
  function middleware(req) {
    // Obtenir le chemin de la page actuelle
    const path = req.nextUrl.pathname;
    
    // Vérifier si l'utilisateur est admin (uniquement pour les routes admin)
    if (path.startsWith('/admin')) {
      const isAdmin = req.nextauth.token?.role === 'ADMIN';
      
      // Si l'utilisateur n'est pas admin, le rediriger vers la page d'accueil
      if (!isAdmin) {
        console.log('User is not admin. Redirecting from admin route.');
        return NextResponse.redirect(new URL('/', req.url));
      }
    }
    
    // Pour toutes les autres routes protégées, l'utilisateur doit simplement être connecté
    // NextAuth s'occupera de cette vérification via le callback authorized ci-dessous
    return NextResponse.next();
  },
  {
    callbacks: {
      // NextAuth vérifiera si un token existe (utilisateur connecté)
      authorized: ({ token }) => {
        console.log('Authorization check:', !!token ? 'User is logged in' : 'User is not logged in');
        return !!token;
      },
    },
    pages: {
      // Page de connexion pour la redirection
      signIn: '/auth/login',
    },
  }
);

// Liste des routes qui requièrent une authentification
export const config = {
  matcher: [
    // Protection de toutes les routes admin
    '/admin',
    '/admin/:path*',
    
    // Protection des routes client spécifiques
    '/client/booking',
    '/client/booking/:path*',
    '/client/profile',
    '/client/profile/:path*',
  ],
}; 