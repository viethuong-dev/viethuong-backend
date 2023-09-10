import { Injectable } from '@nestjs/common';
import { Model, SortOrder, Types } from 'mongoose';
import { PaginationKeySeachQuery } from 'src/util/pagination';
import { buildSearchObjectInTranslation } from 'src/util/helper';
import { BaseModel } from './base.model';
import { omitBy, isUndefined } from 'lodash';

@Injectable()
export class BaseService<M extends BaseModel> {
    protected searchKeys: string[];

    constructor(private model: Model<M>) {}

    async create(model: M) {
        return this.model.create(model);
    }

    async getAndCount(
        pagQuery: PaginationKeySeachQuery,
        otherQuery: object = {},
    ) {
        let options: object = omitBy(otherQuery, isUndefined);
        if (pagQuery.search) {
            const searchOptions = buildSearchObjectInTranslation(
                pagQuery.search,
                this.searchKeys,
            );
            options = { ...options, ...searchOptions };
        }
        const dbQuery = this.model.find(options);
        if (pagQuery.sort) {
            const sortOrder: SortOrder = pagQuery.order === 'asc' ? 1 : -1;
            dbQuery.sort({ [pagQuery.sort]: sortOrder });
        }
        dbQuery.skip(pagQuery.offset).limit(pagQuery.limit);
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
