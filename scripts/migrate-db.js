const { execSync } = require('child_process');

// Cette fonction exécute les migrations Prisma
async function main() {
  try {
    console.log('🔄 Génération du client Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🔄 Création de la première migration...');
    execSync('npx prisma migrate dev --name init', { stdio: 'inherit' });
    
    console.log('✅ Base de données initialisée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de l\'initialisation de la base de données:', error);
    process.exit(1);
  }
}

main(); 