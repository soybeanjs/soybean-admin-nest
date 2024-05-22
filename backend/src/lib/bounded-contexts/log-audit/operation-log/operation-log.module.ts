import { DynamicModule, Module, Provider } from '@nestjs/common';

import { EventHandlers } from './application/event-handlers';
import { QueryHandlers } from './application/query-handlers';

@Module({})
export class OperationLogModule {
  static register(options: {
    inject: Provider[];
    imports: any[];
  }): DynamicModule {
    return {
      module: OperationLogModule,
      imports: [...options.imports],
      providers: [...EventHandlers, ...QueryHandlers, ...options.inject],
      exports: [...QueryHandlers],
    };
  }
}
