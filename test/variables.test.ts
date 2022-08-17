import Foreseen from '../src';
import freshInstance from './freshInstance';
import waitMs from './waitMs';

let instance: Foreseen;

beforeEach(() => {
  instance = freshInstance();
});

describe('variables', () => {
  it('can hold named values that can be in expressions', () => {
    instance.update(`variables:
  exampleA: 1
  exampleB: 2
  exampleC: $now * 100
  exampleD: $exampleA + $exampleB + $exampleC
meshes:
  box:
    position:
      x: $exampleA
      y: $exampleB
      z: $exampleD`);
    const data = instance.data;
    expect(data).toHaveProperty('exampleA', 1);
    expect(data).toHaveProperty('exampleB', 2);
    expect(data).toHaveProperty('exampleC', 0);
    expect(data).toHaveProperty('exampleD', 3);
    instance.render();
    expect(instance.meshes.box.position.x).toBe(1);
    expect(instance.meshes.box.position.y).toBe(2);
    expect(instance.meshes.box.position.z).toBe(3);
  })

  it('works with that too', async () => {
    let shiftX = -10;
    let shiftY = -5;
    instance.update(`variables:
  shiftX: ${shiftX}
  shiftY: ${shiftY}
meshes:
  b1:
    position:
      x: $shiftX
      y: $shiftY
  b2:
    position:
      x: $shiftX
      y: $shiftY + 1
  b3:
    position:
      x: $shiftX
      y: $shiftY + 2
  b4:
    position:
      x: $shiftX
      y: $shiftY + 3
  b5:
    position:
      x: $shiftX
      y: $shiftY + 4
  b6:
    position:
      x: $shiftX
      y: $shiftY + 5
  b7:
    position:
      x: $shiftX
      y: $shiftY + 6
`)
    instance.render();
    let data = instance.data;
    expect(data).toHaveProperty('shiftX', shiftX);
    expect(data).toHaveProperty('shiftY', shiftY);

    let obj = instance.toObject();
    expect(obj).toHaveProperty('variables.shiftX', shiftX);
    expect(obj).toHaveProperty('variables.shiftY', shiftY);

    expect(obj).toHaveProperty('meshes.b1.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b1.position.y', shiftY);
    expect(instance.meshes.b1.position.x).toBe(shiftX);
    expect(instance.meshes.b1.position.y).toBe(shiftY);

    expect(obj).toHaveProperty('meshes.b2.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b2.position.y', shiftY + 1);
    expect(instance.meshes.b2.position.x).toBe(shiftX);
    expect(instance.meshes.b2.position.y).toBe(shiftY + 1);

    expect(obj).toHaveProperty('meshes.b3.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b3.position.y', shiftY + 2);
    expect(instance.meshes.b3.position.x).toBe(shiftX);
    expect(instance.meshes.b3.position.y).toBe(shiftY + 2);

    expect(obj).toHaveProperty('meshes.b4.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b4.position.y', shiftY + 3);
    expect(instance.meshes.b4.position.x).toBe(shiftX);
    expect(instance.meshes.b4.position.y).toBe(shiftY + 3);

    expect(obj).toHaveProperty('meshes.b5.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b5.position.y', shiftY + 4);
    expect(instance.meshes.b5.position.x).toBe(shiftX);
    expect(instance.meshes.b5.position.y).toBe(shiftY + 4);

    expect(obj).toHaveProperty('meshes.b6.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b6.position.y', shiftY + 5);
    expect(instance.meshes.b6.position.x).toBe(shiftX);
    expect(instance.meshes.b6.position.y).toBe(shiftY + 5);

    expect(obj).toHaveProperty('meshes.b7.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b7.position.y', shiftY + 6);
    expect(instance.meshes.b7.position.x).toBe(shiftX);
    expect(instance.meshes.b7.position.y).toBe(shiftY + 6);

    // await waitMs();

    shiftY = -2;
    instance.update(`variables:
  shiftX: ${shiftX}
  shiftY: ${shiftY}
meshes:
  b1:
    position:
      x: $shiftX
      y: $shiftY
  b2:
    position:
      x: $shiftX
      y: $shiftY + 1
  b3:
    position:
      x: $shiftX
      y: $shiftY + 2
  b4:
    position:
      x: $shiftX
      y: $shiftY + 3
  b5:
    position:
      x: $shiftX
      y: $shiftY + 4
  b6:
    position:
      x: $shiftX
      y: $shiftY + 5
  b7:
    position:
      x: $shiftX
      y: $shiftY + 6
`)
    await waitMs();

    data = instance.data;
    instance.render();
    obj = instance.toObject();

    expect(data).toHaveProperty('shiftX', shiftX);
    expect(data).toHaveProperty('shiftY', shiftY);
    expect(instance.toObject()).toHaveProperty('variables.shiftX', shiftX);
    expect(instance.toObject()).toHaveProperty('variables.shiftY', shiftY);

    expect(obj).toHaveProperty('meshes.b1.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b1.position.y', shiftY);
    expect(instance.meshes.b1.position.x).toBe(shiftX);
    expect(instance.meshes.b1.position.y).toBe(shiftY);

    expect(obj).toHaveProperty('meshes.b2.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b2.position.y', shiftY + 1);
    expect(instance.meshes.b2.position.x).toBe(shiftX);
    expect(instance.meshes.b2.position.y).toBe(shiftY + 1);

    expect(obj).toHaveProperty('meshes.b3.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b3.position.y', shiftY + 2);
    expect(instance.meshes.b3.position.x).toBe(shiftX);
    expect(instance.meshes.b3.position.y).toBe(shiftY + 2);

    expect(obj).toHaveProperty('meshes.b4.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b4.position.y', shiftY + 3);
    expect(instance.meshes.b4.position.x).toBe(shiftX);
    expect(instance.meshes.b4.position.y).toBe(shiftY + 3);

    expect(obj).toHaveProperty('meshes.b5.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b5.position.y', shiftY + 4);
    expect(instance.meshes.b5.position.x).toBe(shiftX);
    expect(instance.meshes.b5.position.y).toBe(shiftY + 4);

    expect(obj).toHaveProperty('meshes.b6.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b6.position.y', shiftY + 5);
    expect(instance.meshes.b6.position.x).toBe(shiftX);
    expect(instance.meshes.b6.position.y).toBe(shiftY + 5);

    expect(obj).toHaveProperty('meshes.b7.position.x', shiftX);
    expect(obj).toHaveProperty('meshes.b7.position.y', shiftY + 6);
    expect(instance.meshes.b7.position.x).toBe(shiftX);
    expect(instance.meshes.b7.position.y).toBe(shiftY + 6);
  })
});
