const { execSync } = require('child_process');

// Cette fonction réinitialise complètement la base de données
async function main() {
  try {
    console.log('⚠️ Réinitialisation de la base de données...');
    console.log('⚠️ ATTENTION: Toutes les données seront perdues!');
    
    // Réinitialiser la base de données
    execSync('npx prisma migrate reset --force', { stdio: 'inherit' });
    
    console.log('✅ Base de données réinitialisée avec succès!');
    
    // Générer une nouvelle migration
    console.log('🔄 Création d\'une nouvelle migration...');
    execSync('npx prisma migrate dev --name initial_setup', { stdio: 'inherit' });
    
    console.log('✅ Migration créée avec succès!');
    
    // Appliquer les seeds
    console.log('🔄 Application des seeds...');
    execSync('npx prisma db seed', { stdio: 'inherit' });
    
    console.log('✅ Seeds appliqués avec succès!');
    
    console.log('✅ Base de données complètement initialisée!');
  } catch (error) {
    console.error('❌ Erreur lors de la réinitialisation de la base de données:', error);
    process.exit(1);
  }
}

main(); 