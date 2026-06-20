import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';
import { TaskItem as TaskType } from '../utils/handle-api';

// TODO (Zustand): Mantenha apenas a prop 'task'. Remova 'updateMode' e 'deleteTask'
interface TaskItemProps {
  task: TaskType;
  updateMode: () => void;
  deleteTask: () => void;
}

const TaskItem: React.FC<TaskItemProps> = ({ task, updateMode, deleteTask }) => {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date(new Date().setHours(0, 0, 0, 0));

  return (
    <View className="flex-row items-center justify-between bg-white rounded-xl p-4 mt-3 shadow-sm shadow-black/20 elevation-2">
      <View className="flex-1 mr-3">
        <Text className={`text-base text-gray-900 ${task.completed ? 'line-through text-gray-400' : ''}`}>
          {task.text}
        </Text>
        {task.dueDate && (
          <Text className={`text-xs font-bold mt-1 ${isOverdue ? 'text-red-600' : 'text-green-600'}`}>
            Até: {new Date(task.dueDate).toLocaleDateString()}
          </Text>
        )}
      </View>
      <View className="flex-row items-center gap-4">
        <TouchableOpacity onPress={updateMode} accessibilityRole="button">
          <Feather name="edit" size={20} color="#000" style={{ padding: 2 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteTask} accessibilityRole="button">
          <AntDesign name="delete" size={20} color="#e53935" style={{ padding: 2 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default TaskItem;