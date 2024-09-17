import {createToDo, editToDo, getToDos, toDoDone} from '../../src/Providers/ToDosInfo'
describe('ToDosInfo.createToDo() tests', () => {

    test('createToDo must return true ', (done) => {
      createToDo('gh', 2).then(resp => {
        expect(true).toBe(resp);
        done();
      });
    });

    test('createToDo must return true ', (done) => {
      createToDo('Task', 0).then(resp => {
        expect(true).toBe(resp);
        done();
      });
    });

    test('createToDo must return false ', (done) => {
      createToDo('Task', -1).then(resp => {
        expect(false).toBe(resp);
        done();
      });
    });

    test('createToDo must return false ', (done) => {
      createToDo('Taskbbdwjbbbbbbbbbbbbbbbbddbdbdbdbdbdbdbdbdbdbdbdbbdbdbdbdbdbdbdbdbdbdjbdjbdjbdjbdjbdjbdjbdjbdjbjdbbdjdbjdbjdbjdbjdbjdbjdbjdbbdjdbjdbjdbjdbjdbjdbjdbjbdjdbjdbjdbjdbjdbjdbjdjdbjdbjdbjdbjdbjdbjdbjdjdbjdbjbdjdbjbdjdbjdbjdbjdbjdbjbdjbjd', 1).then(resp => {
        expect(false).toBe(resp);
        done();
      });
    });
    
    test('createToDo must return false', (done) => {
      createToDo('',1).then(resp => {
        expect(false).toBe(resp);
        done();
      });
    });

    test('createToDo must return false', (done) => {
      createToDo('',1, '2024/04/04').then(resp => {
        expect(false).toBe(resp);
        done();
      });
    });
});

describe('ToDosInfo.getToDos tests', () => {
  
  test('getToDos must return != null ', (done) => {
    getToDos(1).then((resp) => {
      expect(resp).toBeDefined
      done();
    });
  });

  test('getToDos must return != null ', (done) => {
    getToDos(1, true, true, 1, true, '').then((resp) => {
      expect(resp).toBeDefined
      done();
    });
  });

  test('getToDos must return null ', (done) => {
    getToDos(-11, undefined, undefined, -1, true, '').then((resp) => {
      expect(resp).toBeNull
      done();
    });
  });
  
});

describe('ToDosInfo.editToDo tests', () => {

  test('editToDo must return true', (done) => {
    editToDo(0, 'Lavar la ropa', 2).then((resp) => {
      expect(resp).toBe(true);
      done();
    });
  });

  test('editToDo must return false', (done) => {
    editToDo(-1, 'Lavar la ropa', 2).then((resp) => {
      expect(resp).toBe(false);
      done();
    });
  });

  test('editToDo must return false', (done) => {
    editToDo(0, 'Lavar la ropa', 4).then((resp) => {
      expect(resp).toBe(false);
      done();
    });
  });
  
});