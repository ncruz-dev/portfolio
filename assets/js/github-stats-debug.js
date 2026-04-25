/**
 * GitHub Stats Debug & Test
 * Útil para verificar que la integración está funcionando
 */

console.log('🔍 GitHub Stats - Debug Mode Iniciado');
console.log('----------------------------------------');

// Test 1: Verificar usuario configurado
const testGitHubUsername = () => {
  console.log('Test 1: Verificar usuario configurado');
  const username = 'ncruz-dev';
  console.log(`✓ Usuario configurado: ${username}`);
  return username;
};

// Test 2: Verificar disponibilidad de API
const testAPIAvailability = async () => {
  console.log('\nTest 2: Verificar disponibilidad de API GitHub');
  try {
    const response = await fetch('https://api.github.com/zen');
    console.log(`✓ API GitHub disponible (Status: ${response.status})`);
    return true;
  } catch (error) {
    console.error('✗ Error de conexión con API GitHub:', error.message);
    return false;
  }
};

// Test 3: Obtener datos del usuario
const testUserData = async () => {
  console.log('\nTest 3: Obtener datos del usuario');
  try {
    const response = await fetch('https://api.github.com/users/ncruz-dev');
    const data = await response.json();
    console.log('✓ Datos del usuario obtenidos:');
    console.table({
      'Usuario': data.login,
      'Repositorios Públicos': data.public_repos,
      'Followers': data.followers,
      'Following': data.following,
      'Repositorios Creados': data.public_repos
    });
    return data;
  } catch (error) {
    console.error('✗ Error obteniendo datos del usuario:', error);
    return null;
  }
};

// Test 4: Obtener repositorios
const testRepositories = async () => {
  console.log('\nTest 4: Obtener repositorios');
  try {
    const response = await fetch('https://api.github.com/users/ncruz-dev/repos?per_page=10');
    const repos = await response.json();
    console.log(`✓ ${repos.length} repositorios obtenidos (mostrando primeros 10):`);
    repos.forEach(repo => {
      console.log(`  - ${repo.name}: ${repo.stargazers_count} ⭐`);
    });
    return repos;
  } catch (error) {
    console.error('✗ Error obteniendo repositorios:', error);
    return null;
  }
};

// Test 5: Contar commits (muestra 1 repo como ejemplo)
const testCommits = async () => {
  console.log('\nTest 5: Contar commits (ejemplo con primer repositorio)');
  try {
    const reposResponse = await fetch('https://api.github.com/users/ncruz-dev/repos?per_page=1');
    const repos = await reposResponse.json();
    
    if (repos.length === 0) {
      console.log('ℹ No hay repositorios públicos');
      return;
    }

    const repoName = repos[0].name;
    const commitsResponse = await fetch(
      `https://api.github.com/repos/ncruz-dev/${repoName}/commits?per_page=1`
    );
    
    const linkHeader = commitsResponse.headers.get('link');
    let commitCount = 0;
    
    if (linkHeader) {
      const matches = linkHeader.match(/&page=(\d+)>; rel="last"/);
      if (matches) {
        commitCount = parseInt(matches[1], 10);
      }
    }
    
    console.log(`✓ Repositorio: ${repoName}`);
    console.log(`  Commits aproximados: ${commitCount || 'Menos de 1 página'}`);
  } catch (error) {
    console.error('✗ Error contando commits:', error);
  }
};

// Test 6: Obtener Pull Requests
const testPullRequests = async () => {
  console.log('\nTest 6: Obtener Pull Requests');
  try {
    const response = await fetch(
      'https://api.github.com/search/issues?q=type:pr+author:ncruz-dev&per_page=1'
    );
    const data = await response.json();
    console.log(`✓ Total de Pull Requests: ${data.total_count}`);
    return data.total_count;
  } catch (error) {
    console.error('✗ Error obteniendo PRs:', error);
    return 0;
  }
};

// Test 7: Verificar elementos HTML
const testHTMLElements = () => {
  console.log('\nTest 7: Verificar elementos HTML');
  
  const elements = {
    'repositories': document.querySelector('[data-stat="repositories"]'),
    'commits': document.querySelector('[data-stat="commits"]'),
    'pullRequests': document.querySelector('[data-stat="pull-requests"]')
  };
  
  Object.entries(elements).forEach(([name, element]) => {
    if (element) {
      console.log(`✓ Elemento [data-stat="${name}"] encontrado`);
    } else {
      console.error(`✗ Elemento [data-stat="${name}"] NO encontrado`);
    }
  });
  
  return elements;
};

// Test 8: Verificar script cargado
const testScriptLoaded = () => {
  console.log('\nTest 8: Verificar si github-stats.js está cargado');
  if (typeof updateGitHubStatsDisplay === 'function') {
    console.log('✓ Función updateGitHubStatsDisplay disponible');
    return true;
  } else {
    console.error('✗ Función updateGitHubStatsDisplay NO disponible');
    return false;
  }
};

// Ejecutar todos los tests
const runAllTests = async () => {
  console.clear();
  console.log('%c🧪 GitHub Stats Integration - Test Suite', 'color: blue; font-size: 16px; font-weight: bold;');
  console.log('=========================================\n');

  testGitHubUsername();
  const apiAvailable = await testAPIAvailability();
  
  if (!apiAvailable) {
    console.error('\n❌ No hay conexión con API GitHub. Detener tests.');
    return;
  }

  await testUserData();
  await testRepositories();
  await testCommits();
  await testPullRequests();
  testHTMLElements();
  testScriptLoaded();

  console.log('\n%c✅ Tests completados', 'color: green; font-size: 14px; font-weight: bold;');
  console.log('=========================================');
};

// Ejecutar cuando el DOM esté listo
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('\n💡 Para ejecutar los tests, llama a: runAllTests()');
  });
} else {
  console.log('\n💡 Para ejecutar los tests, llama a: runAllTests()');
}

// Exportar para uso manual
window.testGitHubStats = {
  runAll: runAllTests,
  testUser: testUserData,
  testRepos: testRepositories,
  testCommits: testCommits,
  testPRs: testPullRequests,
  testAPI: testAPIAvailability
};
