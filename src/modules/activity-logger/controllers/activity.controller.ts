import { AllowAnonymous } from '@account/decorators/allow-anonymous.decorator';
import { RolesGuard } from '@account/guards/role.quards';
import { ActivityResponse } from '@activity-logger/usecases/activities/activity.response';
import { ActivityCommands } from '@activity-logger/usecases/activities/activity.usecase.commands';
import { ActivityQuery } from '@activity-logger/usecases/activities/activity.usecase.queries';
import { CollectionQuery } from '@libs/collection-query/collection-query';
import { ApiPaginatedResponse } from '@libs/response-format/api-paginated-response';
import { DataResponseFormat } from '@libs/response-format/data-response-format';
import {
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiExtraModels,
  ApiOkResponse,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';

@Controller('activities')
@ApiTags('activities')
@ApiResponse({ status: 500, description: 'Internal error' })
@ApiResponse({ status: 404, description: 'Item not found' })
@ApiExtraModels(DataResponseFormat)
export class ActivitiesController {
  constructor(
    private command: ActivityCommands,
    private activityQuery: ActivityQuery,
  ) {}
  @Get('get-activity/:id')
  @ApiOkResponse({ type: ActivityResponse })
  async getActivity(@Param('id') id: string) {
    return this.activityQuery.getActivity(id);
  }
  @Get('get-activities')
  @ApiPaginatedResponse(ActivityResponse)
  async getActivities(@Query() query: CollectionQuery) {
    return this.activityQuery.getActivities(query);
  }
  @Delete('archive-activity/:id')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: Boolean })
  async archiveActivity(@Param('id') id: string) {
    return this.command.archiveActivity(id);
  }
  @Delete('delete-activity/:id')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: Boolean })
  async deleteActivity(@Param('id') id: string) {
    return this.command.deleteActivity(id);
  }
  @Post('restore-activity/:id')
  @UseGuards(RolesGuard('admin'))
  @ApiOkResponse({ type: ActivityResponse })
  async restoreActivity(@Param('id') id: string) {
    return this.command.restoreActivity(id);
  }
  @Get('get-archived-activities')
  @ApiPaginatedResponse(ActivityResponse)
  async getArchivedActivities(@Query() query: CollectionQuery) {
    return this.activityQuery.getArchivedActivities(query);
  }
}
