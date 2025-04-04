const { execSync } = require('child_process');

// Cette fonction initialise la base de données PostgreSQL
async function main() {
  try {
    console.log('🔄 Génération du client Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🔄 Création d\'une nouvelle migration initiale...');
    execSync('npx prisma migrate dev --name init_postgres --create-only', { stdio: 'inherit' });
    
    console.log('🔄 Application de la migration...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('✅ Base de données initialisée avec succès !');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

main(); 