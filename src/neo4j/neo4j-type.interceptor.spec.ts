import { Neo4jTypeInterceptor } from './neo4j-type.interceptor';
import { Observable } from 'rxjs';

describe('Neo4jTypeInterceptor', () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const interceptor: Neo4jTypeInterceptor = new Neo4jTypeInterceptor();

  it('should convert a Node', () => {
    const callHandler = {
      handle: jest.fn().mockReturnThis(),
      pipe: jest.fn().mockReturnValue(
        new Observable((subscriber) => {
          subscriber.next('foo');
        }),
      ),
    };
    expect(callHandler.handle).toBeCalledTimes(1);
    expect(callHandler.pipe).toBeCalledTimes(1);
  });
});
