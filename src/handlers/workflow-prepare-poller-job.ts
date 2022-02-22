import { PollerJob, TaskStateMap } from '../common/models';
import { ParamResolver } from '../common/params-resolver';
import { AwsProxy } from '../common/aws-proxy';
import { PayloadProxyService } from '../services/payload-proxy-service';
import { JobService } from '../services/job-service';

const paramResolver = new ParamResolver();
const awsProxy = new AwsProxy(paramResolver);
const jobService = new JobService(awsProxy, paramResolver);
const payloadProxyService = new PayloadProxyService();

export const handler = async (event: any) : Promise<PollerJob> => {

    const jobId = event.id;
    const metadata = await payloadProxyService.getMetadataAsync(event.detail.url);
    const tasks = jobService.createPollerTasks(jobId, metadata);

    return {
        tasks: tasks,
        taskStateMap: new TaskStateMap()
    };
}

//FIRST CALL TO GET METADATA: totalItems and maxPerPage
// getMetadataAsync = async (url: string) : Promise<RequestMetadata> =>  {
//     const result = await this.executeRequestAsync({
//         BaseUrl: url,
//         StartAt: 0,
//         Count: 1
//     });

//     return {
//         BaseUrl: url,
//         MaxRecordsPerPage: result.maxRecordsPerPage,
//         TotalRecordsToBeLoaded: result.totalRecords
//     };
// }

// private executeRequestAsync = async (request: PagedRequest) : Promise<any> => {
//     try {
//         const result = await axios.get(request.BaseUrl, {
//             headers: {
//                 'cache-control': 'no-cache',
//                 'content-type': 'text/plain'
//             },
//             params: {
//                 'startAt': request.StartAt,
//                 'count': request.Count
//             }
//         });

//         return result.data;
//     } catch (err) {
//         console.log('Error', JSON.stringify(err));
//         // we are considering this error intermittent and will want to retry it
//         throw retriableErrorFactory.retriablePollerError(err);
//     }
// }
// }


// createPollerTasks = (jobId: string, metadata: RequestMetadata): PollerTask[] => {
//     const ttl = this.calculateTimeToLive();
//     const tasks: PollerTask[] = [];

//     let index: number = 0;
//     while (index < metadata.TotalRecordsToBeLoaded) {
//         tasks.push({
//             request: {
//                 StartAt: index,
//                 Count: metadata.MaxRecordsPerPage,
//                 BaseUrl: metadata.BaseUrl
//             },
//             jobId: jobId,
//             taskId: uuid.v1(),
//             ttl: ttl
//         });
//         index += metadata.MaxRecordsPerPage;
//     }
//     return tasks;
}
