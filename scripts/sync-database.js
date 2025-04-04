const { execSync } = require('child_process');

// Cette fonction synchronise la base de données avec le schéma Prisma
async function main() {
  try {
    console.log('🔄 Génération du client Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🔄 Application directe du schéma Prisma à la base de données...');
    execSync('npx prisma db push --force-reset', { stdio: 'inherit' });
    
    console.log('✅ Base de données synchronisée avec succès!');

    // On utilise le script JavaScript simple
    console.log('🔄 Application des données de test...');
    execSync('node prisma/seed-simple.js', { stdio: 'inherit' });
    console.log('✅ Données de test appliquées avec succès!');
    
  } catch (error) {
    console.error('❌ Erreur lors de la synchronisation de la base de données:', error);
    process.exit(1);
  }
}

main(); 