const { execSync } = require('child_process');

// Cette fonction exécute les migrations Prisma en production
async function main() {
  try {
    console.log('🔄 Génération du client Prisma...');
    execSync('npx prisma generate', { stdio: 'inherit' });
    
    console.log('🔄 Déploiement des migrations en production...');
    execSync('npx prisma migrate deploy', { stdio: 'inherit' });
    
    console.log('✅ Base de données de production migrée avec succès!');
  } catch (error) {
    console.error('❌ Erreur lors de la migration de la base de données:', error);
    process.exit(1);
  }
}

main(); 