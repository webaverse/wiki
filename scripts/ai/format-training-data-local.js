import { getTrainingItems } from '../../datasets/dataset-specs.js';

// get the base path from the command line args

const basePath = process.argv[2] ?? "./";

console.log('basepath is')
console.log(basePath)
const _run = async (req, res) => {
  const items = await getTrainingItems(basePath);
  console.log('items are')
  console.log(items)
  process.stdout.write(
    items.map(item => JSON.stringify(item))
      .join('\n')
  );
};
_run();