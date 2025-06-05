export function isDataLoaded(gameData, personaData) {
  return (
    gameData.races?.length > 0 &&
    gameData.professions?.length > 0 &&
    gameData.trainings?.length > 0 &&
    gameData.skills?.length > 0 &&
    gameData.powers?.length > 0 &&
    !!personaData
  );
}

export function showDataLoadError(missingFile) {
  if (typeof document === 'undefined') return;
  let modal = document.getElementById('data-error-modal');
  const message = missingFile
    ? `Failed to load ${missingFile}. Verify the file exists and refresh this page.`
    : 'Game data could not be loaded. Please verify the server is running and refresh this page.';
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'data-error-modal';
    modal.className = 'error-modal neon-frame';
    modal.textContent = message;
    document.body.appendChild(modal);
  } else {
    modal.textContent = message;
  }
}

export function verifyDataLoaded(gameData, personaData) {
  if (!isDataLoaded(gameData, personaData)) {
    console.log('Game data failed to load. Check that the server is running.');
    showDataLoadError();
    return false;
  }
  return true;
}
