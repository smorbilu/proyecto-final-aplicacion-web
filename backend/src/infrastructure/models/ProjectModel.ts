import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/connection';

interface ProjectAttributes {
  id: number;
  name: string;
  description?: string;
}

interface ProjectCreationAttributes extends Optional<ProjectAttributes, 'id'> {}

class ProjectModel extends Model<ProjectAttributes, ProjectCreationAttributes>
  implements ProjectAttributes {
  public id!: number;
  public name!: string;
  public description?: string;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

ProjectModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(150),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    tableName: 'projects',
    timestamps: true,
  }
);

export default ProjectModel;
