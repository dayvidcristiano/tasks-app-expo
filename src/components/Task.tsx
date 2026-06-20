import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { Feather, AntDesign } from '@expo/vector-icons';

interface TaskProps {
  text: string;
  updateMode: () => void;
  deleteTask: () => void;
}

const Task: React.FC<TaskProps> = ({ text, updateMode, deleteTask }) => {
  return (
    <View className="flex-row items-center justify-between bg-white rounded-xl p-4 mt-4 shadow-sm shadow-black/20 elevation-2">
      <Text className="flex-1 text-base text-gray-800 mr-4">{text}</Text>
      <View className="flex-row items-center gap-4 ml-4">
        <TouchableOpacity onPress={updateMode}>
          <Feather name="edit" size={20} color="#000" style={{ padding: 2 }} />
        </TouchableOpacity>
        <TouchableOpacity onPress={deleteTask}>
          <AntDesign name="delete" size={20} color="#e53935" style={{ padding: 2 }} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default Task;