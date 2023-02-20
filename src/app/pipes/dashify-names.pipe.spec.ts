import { DashifyNamesPipe } from './dashify-names.pipe';

describe('DashifyNamesPipe', () => {

  let pipe: DashifyNamesPipe;

  beforeEach(() => {
    pipe = new DashifyNamesPipe();
  })

  it('should replace all spaces with a dash', () => {
    const actual = pipe.transform('my team name has spaces');
    expect(actual).toBe('my-team-name-has-spaces');
  });

  it('should lower-case all letters', () => {
    const actual = pipe.transform('My Name Has Caps');
    expect(actual).toBe('my-name-has-caps');
  })

  it('should replace any non-alpha non-numeric character with a dash', () => {
    const actual = pipe.transform('we are #1! & *totally* r()ck$');
    expect(actual).toBe('we-are--1-----totally--r--ck-')
  })
});
