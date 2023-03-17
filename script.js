async function* createDeferredValuesPool(asyncFunctions) {
  let asyncFct;
  while (asyncFct = asyncFunctions.shift()) {

    yield (await asyncFct());
  }
}
function createDeferredValueAction(value, delay) {
  return async function () {
    return await (
      new Promise(resolve => setTimeout(resolve, delay, value))
    );
  }
}

async function typeLine(rootNode, line, lineTemplate, charDelay) {
  rootNode
    .insertAdjacentHTML('beforeend', lineTemplate);

  const lineNode = [...rootNode
    .querySelectorAll('[data-line-content]')
  ]
  .slice(-1)[0]; // instead of the not entirely supported `.at(-1)`.

  const deferredCharacterActions = line
    .split('')
    .map(char =>
      createDeferredValueAction(char, charDelay)
    );
  const deferredCharactersPool =
    createDeferredValuesPool(deferredCharacterActions);

    for await (const char of deferredCharactersPool) {
    lineNode.textContent = lineNode.textContent + char;
  }
}
async function typeLines(
  rootNode = document.body,
  lines = [],
  lineTemplate = '<p data-line-content></p>',
  lineDelay = 200,
  charDelay = 10,
) {
  const deferredNewLineActions = lines
    .map(line =>
      createDeferredValueAction(line, lineDelay)
    );
  const deferredNewLinesPool =
    createDeferredValuesPool(deferredNewLineActions);

  for await (const line of deferredNewLinesPool) {

    await typeLine(rootNode, line, lineTemplate, charDelay);
  }
}

(async () => {
  await typeLines(
    document.body,
    ['They flip the camera and hold the phone up to their face, and smile.', 'It feels good to not have to spend hours editing their photos, and just post out of enjoyment.', 'That is what they forgot about.', 'The enjoyment.'],
    '<span data-line-content class="textStyle"></span><br></br>',
    400,
    30,
  );
  await typeLines(
    document.body,
    [userName + '\xa0' + 'captions the post; The real me.', 'They feel nervous.'],
    '<span data-line-content></span><br></br>',
    400,
    30,
  );
})();
