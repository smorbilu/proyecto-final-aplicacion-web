import { DataTypes, Model, Optional } from 'sequelize';
import sequelize from '../database/connection';
import ProjectModel from './ProjectModel';

interface TaskAttributes {
  id: number;
  title: string;
  description?: string;
  status: 'pending' | 'in_progress' | 'completed';
  projectId: number;
}

interface TaskCreationAttributes extends Optional<TaskAttributes, 'id'> {}

class TaskModel extends Model<TaskAttributes, TaskCreationAttributes>
  implements TaskAttributes {
  public id!: number;
  public title!: string;
  public description?: string;
  public status!: 'pending' | 'in_progress' | 'completed';
  public projectId!: number;
  public readonly createdAt!: Date;
  public readonly updatedAt!: Date;
}

TaskModel.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    title: {
      type: DataTypes.STRING(200),
      allowNull: false,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    status: {
      type: DataTypes.ENUM('pending', 'in_progress', 'completed'),
      allowNull: false,
      defaultValue: 'pending',
    },
    projectId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: ProjectModel,
        key: 'id',
      },
      onDelete: 'CASCADE',
    },
  },
  {
    sequelize,
    tableName: 'tasks',
    timestamps: true,
  }
);

ProjectModel.hasMany(TaskModel, { foreignKey: 'projectId', as: 'tasks', onDelete: 'CASCADE' });
TaskModel.belongsTo(ProjectModel, { foreignKey: 'projectId', as: 'project' });

export default TaskModel;
