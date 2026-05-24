import { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  async create(data: Partial<T>): Promise<T> {
    return await this.model.create(data);
  }

  async findById(id: string): Promise<T | null> {
    return await this.model.findById(id);
  }

  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return await this.model.findOne(filter);
  }

  async find(filter: FilterQuery<T> = {}): Promise<T[]> {
    return await this.model.find(filter);
  }

  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return await this.model.findByIdAndUpdate(id, update, {
      new: true,
      runValidators: true,
    });
  }

  async deleteById(id: string): Promise<T | null> {
    return await this.model.findByIdAndDelete(id);
  }

  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return await this.model.countDocuments(filter);
  }

  async paginate(
    filter: FilterQuery<T> = {},
    page: number = 1,
    limit: number = 10,
    populate: string[] = [],
    sort: Record<string, 1 | -1> = { createdAt: -1 }
  ) {
    const skip = (page - 1) * limit;

    let query = this.model.find(filter).sort(sort).skip(skip).limit(limit);

    populate.forEach((field) => {
      query = query.populate(field);
    });

    const [data, total] = await Promise.all([query, this.model.countDocuments(filter)]);

    return {
      data,
      total,
      currentPage: page,
      totalPages: Math.ceil(total / limit),
    };
  }
}
