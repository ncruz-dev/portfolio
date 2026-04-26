/**
 * GitHub Stats API
 * Obtiene estadísticas de la cuenta de GitHub del usuario
 */

// const GITHUB_USERNAME = 'ncruz-dev';
// const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Obtiene las estadísticas de GitHub
 */
/*async function getGitHubStats() {
  try {
    // Obtener información del usuario
    const userResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}`);
    if (!userResponse.ok) throw new Error('Error obteniendo datos del usuario');
    const userData = await userResponse.json();

    // Obtener repositorios para contar commits
    const reposResponse = await fetch(`${GITHUB_API_BASE}/users/${GITHUB_USERNAME}/repos?per_page=100`);
    if (!reposResponse.ok) throw new Error('Error obteniendo repositorios');
    const repos = await reposResponse.json();

    // Obtener pull requests del usuario
    const prsResponse = await fetch(
      `${GITHUB_API_BASE}/search/issues?q=type:pr+author:${GITHUB_USERNAME}&per_page=1`
    );
    if (!prsResponse.ok) throw new Error('Error obteniendo pull requests');
    const prsData = await prsResponse.json();

    // Contar commits en todos los repositorios
    let totalCommits = 0;
    for (const repo of repos) {
      try {
        const commitsResponse = await fetch(
          `${GITHUB_API_BASE}/repos/${GITHUB_USERNAME}/${repo.name}/commits?per_page=1`
        );
        if (commitsResponse.ok) {
          const linkHeader = commitsResponse.headers.get('link');
          if (linkHeader) {
            const matches = linkHeader.match(/&page=(\d+)>; rel="last"/);
            if (matches) {
              totalCommits += parseInt(matches[1], 10);
            }
          } else {
            // Si no hay link header, es menos de 1 página
            const commitsData = await commitsResponse.json();
            totalCommits += commitsData.length;
          }
        }
      } catch (e) {
        // Continuar con el siguiente repositorio si hay error
        console.log(`Error contando commits en ${repo.name}`);
      }
    }

    return {
      repositories: userData.public_repos || 0,
      commits: totalCommits,
      pullRequests: prsData.total_count || 0,
      followers: userData.followers || 0,
      stars: repos.reduce((sum, repo) => sum + (repo.stargazers_count || 0), 0)
    };
  } catch (error) {
    console.error('Error fetching GitHub stats:', error);
    return null;
  }
}*/

/**
 * Actualiza los números en la página
 */
async function updateGitHubStatsDisplay() {
  const stats = await getGitHubStats();

  if (!stats) {
    console.error('No se pudieron obtener las estadísticas de GitHub');
    return;
  }

  // Actualizar los elementos con los datos obtenidos
  const elements = {
    repositories: document.querySelector('[data-stat="repositories"]'),
    commits: document.querySelector('[data-stat="commits"]'),
    pullRequests: document.querySelector('[data-stat="pull-requests"]')
  };

  if (elements.repositories) {
    elements.repositories.setAttribute('data-number', stats.repositories);
    elements.repositories.textContent = stats.repositories;
  }

  if (elements.commits) {
    elements.commits.setAttribute('data-number', stats.commits);
    elements.commits.textContent = stats.commits;
  }

  if (elements.pullRequests) {
    elements.pullRequests.setAttribute('data-number', stats.pullRequests);
    elements.pullRequests.textContent = stats.pullRequests;
  }

  // Si hay contador animado, reiniciar la animación
  if (typeof animateCounters === 'function') {
    animateCounters();
  }
}

/**
 * Animar los números con efecto de incremento
 */
function animateCounters() {
  const counters = document.querySelectorAll('.number[data-stat]');
  
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-number'), 10);
    const increment = Math.ceil(target / 30); // Incrementar en 30 pasos
    let current = 0;

    const updateCount = () => {
      current += increment;
      if (current < target) {
        counter.textContent = current.toLocaleString();
        requestAnimationFrame(updateCount);
      } else {
        counter.textContent = target.toLocaleString();
      }
    };

    updateCount();
  });
}

/**
 * Inicializar cuando el DOM esté listo
 */
document.addEventListener('DOMContentLoaded', () => {
  updateGitHubStatsDisplay();
});

/**
 * Actualizar estadísticas cada 30 minutos
 */
setInterval(updateGitHubStatsDisplay, 30 * 60 * 1000);
