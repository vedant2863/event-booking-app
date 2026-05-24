import type { Document, FilterQuery, Model, UpdateQuery } from 'mongoose';

export class BaseRepository<T extends Document> {
  protected model: Model<T>;

  constructor(model: Model<T>) {
    this.model = model;
  }

  /**
   * Create document
   */
  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  /**
   * Find by ID
   */
  async findById(id: string): Promise<T | null> {
    return this.model.findById(id).exec();
  }

  /**
   * Find one document
   */
  async findOne(filter: FilterQuery<T>): Promise<T | null> {
    return this.model.findOne(filter).exec();
  }

  /**
   * Find all documents
   */
  async findAll(filter: FilterQuery<T> = {}): Promise<T[]> {
    return this.model.find(filter).exec();
  }

  /**
   * Update by ID
   */
  async updateById(id: string, update: UpdateQuery<T>): Promise<T | null> {
    return this.model
      .findByIdAndUpdate(id, update, {
        new: true,
        runValidators: true,
      })
      .exec();
  }

  /**
   * Delete by ID
   */
  async deleteById(id: string): Promise<T | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  /**
   * Count documents
   */
  async count(filter: FilterQuery<T> = {}): Promise<number> {
    return this.model.countDocuments(filter).exec();
  }
}
