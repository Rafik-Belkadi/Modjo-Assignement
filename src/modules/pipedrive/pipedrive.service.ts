import {
  HttpException,
  HttpService,
  HttpStatus,
  Inject,
  Injectable,
} from '@nestjs/common';
import { CommentService } from '../comments/comments.service';
import Activity from './pipedrive.interface';

@Injectable()
export class PipedriveService {
  /* Injected CommentService to access the getComment Method */
  constructor(
    @Inject('CommentService')
    private readonly commentService: CommentService,
    private httpService: HttpService,
  ) {}
  /* You can this API Key to play with Pipedrive's API */
  private readonly apiKey = '0247338e7729ebe37a5bc7af67a3fb5c21419a30';

  /**
   * This is the base url for Pipedrive API
   * Full documentation: https://developers.pipedrive.com/docs/api/v1
   */
  private readonly baseUrl = 'https://api.pipedrive.com/v1/';

  /*
   * get an activity and update its note field accordingly to the instructions provided
   */
  async editNote(commentId: number) {
    /* Getting the comment to be pushed from the db */
    const comment = await this.commentService.getComment(commentId);

    /* If the call associated with the comment does not have a crmActivityId, throw an error */
    if (comment == null || comment?.call == null)
      throw new HttpException(
        'EXPECTATION FAILED : Comment not found',
        HttpStatus.EXPECTATION_FAILED,
      );

    if (comment.call.crmActivityId == null) {
      throw new HttpException(
        'EXPECTATION FAILED : Does not contain a crmActivityId',
        HttpStatus.EXPECTATION_FAILED,
      );
    }

    /* Getting the activity by id from the api */
    const activity = await this.getActivity(comment.call.crmActivityId);

    return await this.editActivity(activity, comment.comment);
  }

  /*
   * fetch (GET) to getActivity by id
   */
  async getActivity(crmActivityId: string): Promise<Activity> {
    try {
      const response = await this.httpService
        .get(
          this.baseUrl + `activities/${crmActivityId}?api_token=${this.apiKey}`,
        )
        .toPromise();
      const activity: Activity = await response.data.data;
      /* Cheking if it is the first comment pushed to the activity note */
      return activity;
    } catch (error) {
      throw new HttpException(
        'Internal Server error: could not retrieve activity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  /*
   * fetch (PUT) to update the activity
   */
  async editActivity(activity: Activity, comment: string) {
    let updatedActivity;
    /* Check if the activity note has an already pushed comment */
    if (activity.note.indexOf('Comment on Modjo:') >= 0) {
      /* Just add the comment to a new line if there is a previous comment pushed. */
      updatedActivity = {
        ...activity,
        note: activity.note + `<br>${comment}`,
      };
    } else {
      /* Push the comment with the sentence "Comment on Modjo" before comment. */
      updatedActivity = {
        ...activity,
        note: activity.note + `<br>Comment on Modjo:<br>${comment}`,
      };
    }
    try {
      /* Update the activity note by calling the api using the built-in httpModule */
      const response = await this.httpService
        .put(
          this.baseUrl + `activities/${activity.id}?api_token=${this.apiKey}`,
          updatedActivity,
        )
        .toPromise();
      return response.data;
    } catch (error) {
      throw new HttpException(
        'Internal Server error: Could not edit activity',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}
