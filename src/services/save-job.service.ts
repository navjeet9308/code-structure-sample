/**
 * Service Methods
 */

import { HttpException } from '../exceptions/HttpException'
import { SaveJob } from '@my-app/common/src/candidate/save-job.interface'
import saveJobModel from '../models/job-save';
import { isEmpty } from '../utils/utility';
import { Service } from "typedi";
@Service()
class SaveJobService {

  public async findAll(req: any): Promise<SaveJob[]> {
    const sortKey = req.sort ? req.sort : { execution_at: -1 };
    const skipVal = req.skip ? req.skip : 0;
    const limitVal = req.limit ? req.limit : 5;
    const filter = req.filter ? req.filter : {}
    console.log('req>>>>>>>>>>>>>>', req);
    const data: any = await saveJobModel.find(filter).sort(sortKey).skip(skipVal*limitVal).limit(limitVal);
    return data;
  }

  public async findById(id: string): Promise<SaveJob> {
    if (isEmpty(id)) throw new HttpException(400, "Job Id is required");

    const findJob: SaveJob | null = await saveJobModel.findOne({ job_id: id }!);
    if (!findJob) throw new HttpException(400, "Job not found");

    return findJob;
  }

  public async createData(data: SaveJob): Promise<SaveJob> {
    if (isEmpty(data)) throw new HttpException(400, "Save data is required");

    const createData:any = await saveJobModel.create({ ...data });

    return createData;
  }

  public async updateData(id: string, data: SaveJob): Promise<SaveJob> {
    if (isEmpty(data)) throw new HttpException(400, "Save Job data is required");

    const updateById: SaveJob | null = await saveJobModel.findByIdAndUpdate(id, data);
    if (!updateById) throw new HttpException(400, "Failed to update Save Job");

    return updateById;
  }

  public async deleteData(modelId: string): Promise<SaveJob> {
    const deleteById: SaveJob | null = await saveJobModel.findByIdAndDelete(modelId);
    if (!deleteById) throw new HttpException(409, "Failed to delete data");

    return deleteById;
  }
}

export default SaveJobService;

