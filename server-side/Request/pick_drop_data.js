import { createRequire } from 'module';
const require = createRequire(import.meta.url);

const { Heap } = require('heap-js');

const pick_drop_data = (request_heap, timeData, startKey, endKey, speed) => {
  //현재 heap에 있는 제일 작은 값이 전송되어야 할 값을때만 돌아감
  while (
    request_heap.peek()['time'] <= endKey &&
    request_heap.peek()['time'] >= startKey
  ) {
    let data = request_heap.pop();
    let index = parseInt(speed * (data.time - startKey));

    timeData[index].push({ category: 'delete', id: data.id });
  }
};

export { pick_drop_data };
