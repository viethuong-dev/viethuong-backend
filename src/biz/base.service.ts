import { Injectable } from '@nestjs/common';
import { Model, SortOrder, Types } from 'mongoose';
import { PaginationKeySeachQuery } from 'src/util/pagination';
import { buildSearchObjectInTranslation } from 'src/util/helper';
import { BaseModel } from './base.model';

@Injectable()
export class BaseService<M extends BaseModel> {
    protected searchKeys: string[];

    constructor(private model: Model<M>) {}

    async create(model: M) {
        return this.model.create(model);
    }

    async getAndCount(reqQuery: PaginationKeySeachQuery) {
        let options = {};
        if (reqQuery.search) {
            options = buildSearchObjectInTranslation(
                reqQuery.search,
                this.searchKeys,
            );
        }
        const dbQuery = this.model.find(options);
        if (reqQuery.sort) {
            const sortOrder: SortOrder = reqQuery.order === 'asc' ? 1 : -1;
            dbQuery.sort({ [reqQuery.sort]: sortOrder });
        }
        dbQuery.skip(reqQuery.offset).limit(reqQuery.limit);
        return Promise.all([dbQuery, this.model.count(options)]);
    }

    async findById(id: string | Types.ObjectId): Promise<M | null> {
        try {
            return await this.model.findById(id);
        } catch (error) {
            return null;
        }
    }

    async update(id: string | Types.ObjectId, model: M): Promise<M> {
        return this.model.findByIdAndUpdate(id, model, { new: true });
    }

    async delete(id: string | Types.ObjectId): Promise<M> {
        return this.model.findByIdAndDelete(id);
    }
}
