import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, SafeAreaView, Platform, Image, Pressable, ActivityIndicator, Modal } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import Checkbox from 'expo-checkbox';
import DateTimePicker from '@react-native-community/datetimepicker';
import { GluestackUIProvider } from '@/components/ui/gluestack-ui-provider';
import { Input, InputField } from '@/components/ui/input';
import { Button, ButtonText } from '@/components/ui/button';
import TaskList from './src/components/TaskList';
import { addTask, deleteTask, getAllTasks, updateTask, TaskItem } from './src/utils/handle-api';
import { globalStyles } from './src/styles/global';
import AboutScreen from './src/components/AboutScreen';
import ConfirmDeleteDialog from './src/components/ConfirmDeleteDialog';
import '@/global.css';

export default function App() {
  // Estados corrigidos dentro do componente
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [text, setText] = useState("");
  const [isUpdating, setIsUpdating] = useState(false);
  const [taskId, setTaskId] = useState("");
  const [loading, setLoading] = useState(true);
  const [logoError, setLogoError] = useState(false);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [aboutModalVisible, setAboutModalVisible] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [completed, setCompleted] = useState(false);
  const [dueDate, setDueDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [priority, setPriority] = useState<'Baixa' | 'Média' | 'Alta'>('Baixa');

  useEffect(() => {
    getAllTasks(setTasks, setLoading);
  }, []);

  const resetForm = () => {
    setText("");
    setCompleted(false);
    setDueDate(null);
    setPriority('Baixa');
    setIsUpdating(false);
    setTaskId("");
    setModalVisible(false);
  };

  const updateMode = (task: TaskItem) => {
    setIsUpdating(true);
    setTaskId(task._id);
    setText(task.text);
    setCompleted(!!task.completed);
    setDueDate(task.dueDate ? new Date(task.dueDate) : null);
    setModalVisible(true);
  };

  const handleSave = () => {
    const formattedDate = dueDate ? dueDate.toISOString() : null;
    if (isUpdating) {
      updateTask(taskId, text, completed, formattedDate, setTasks, resetForm);
    } else {
      addTask(text, completed, formattedDate, setTasks, resetForm);
    }
  };

  const onChangeDate = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) setDueDate(selectedDate);
  };

  return (
    <GluestackUIProvider mode="light">
      <SafeAreaView className="flex-1 bg-gray-100">
        <View className="flex-1 w-full max-w-[600px] self-center px-4">
          <View style={styles.headerContainer}>
            {logoError ? (
              <Text style={styles.header}>Gerenciador de Tarefas</Text>
            ) : (
              <Image
                source={require('./assets/task-app-banner.png')}
                style={styles.logo}
                onError={() => setLogoError(true)}
              />
            )}
            {!logoError && <Text style={styles.header}>Tarefas</Text>}
          </View>

          <View style={styles.counterContainer}>
            <Text style={styles.counterText}>Total de Tarefas: {tasks.length}</Text>
          </View>

          <View style={styles.filterContainer}>
            {(['all', 'completed', 'pending'] as const).map((f) => (
              <TouchableOpacity
                key={f}
                style={[styles.filterButton, filter === f ? styles.filterButtonActive : styles.filterButtonInactive]}
                onPress={() => setFilter(f)}
              >
                <Text style={filter === f ? styles.filterTextActive : styles.filterTextInactive}>
                  {f === 'all' ? 'Todas' : f === 'completed' ? 'Concluídas' : 'Pendentes'}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.actionButtonsContainer}>
            <Button className="flex-1 bg-black rounded-lg shadow elevation-3" onPress={() => setModalVisible(true)}>
              <ButtonText className="font-bold tracking-wide">Nova Tarefa</ButtonText>
            </Button>
            <Pressable
              style={({ pressed }) => [styles.actionButton, styles.deleteButton, pressed && styles.deleteButtonPressed]}
              onPress={() => setTasks([])}
            >
              <Text style={styles.actionButtonText}>Excluir todas</Text>
            </Pressable>
          </View>

          <View style={styles.aboutButtonContainer}>
            <Button variant="outline" onPress={() => setAboutModalVisible(true)}>
              <ButtonText>Sobre o App</ButtonText>
            </Button>
          </View>

          <TaskList
            tasks={tasks.filter(t => {
              if (filter === 'completed') return t.completed;
              if (filter === 'pending') return !t.completed;
              return true;
            })}
            onUpdate={updateMode}
            onDelete={(id) => setDeleteTargetId(id)}
          />

          {loading && (
            <View style={styles.loaderContainer}>
              <ActivityIndicator size="large" color="#000" />
            </View>
          )}
        </View>

        <Modal
          visible={modalVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={resetForm}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{isUpdating ? "Editar Tarefa" : "Nova Tarefa"}</Text>
              <Input variant="outline" size="md" className="mb-4">
                <InputField placeholder="Nome da tarefa..." value={text} maxLength={50} onChangeText={setText} />
              </Input>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Data limite:</Text>
                {Platform.OS === 'web' ? (
                  <input
                    type="date"
                    value={dueDate ? dueDate.toISOString().split('T')[0] : ''}
                    onChange={(e: any) => {
                      const val = e.target.value;
                      if (val) {
                        const parts = val.split('-');
                        setDueDate(new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2])));
                      } else {
                        setDueDate(null);
                      }
                    }}
                    style={{ padding: 8, borderRadius: 4, border: '1px solid #ccc', flex: 1, marginLeft: 16 }}
                  />
                ) : (
                  <View style={{ flex: 1, marginLeft: 16, alignItems: 'flex-start' }}>
                    <TouchableOpacity onPress={() => setShowDatePicker(true)} style={styles.datePickerBtn}>
                      <Text>{dueDate ? dueDate.toLocaleDateString() : "Selecionar Data"}</Text>
                    </TouchableOpacity>
                    {showDatePicker && (
                      <DateTimePicker
                        value={dueDate || new Date()}
                        mode="date"
                        display="default"
                        onChange={onChangeDate}
                      />
                    )}
                  </View>
                )}
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Concluída:</Text>
                <View style={styles.checkboxContainer}>
                  <Checkbox value={completed} onValueChange={setCompleted} color={completed ? '#000' : undefined} />
                </View>
              </View>

              <View style={styles.fieldRow}>
                <Text style={styles.fieldLabel}>Prioridade:</Text>
                <View style={styles.priorityContainer}>
                  {['Baixa', 'Média', 'Alta'].map((p) => (
                    <TouchableOpacity
                      key={p}
                      style={[
                        styles.priorityButton,
                        priority === p && {
                          backgroundColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336',
                          borderColor: p === 'Baixa' ? '#4caf50' : p === 'Média' ? '#ff9800' : '#f44336'
                        }
                      ]}
                      onPress={() => setPriority(p as any)}
                    >
                      <Text style={[styles.priorityText, priority === p && styles.priorityTextActive]}>{p}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <View style={styles.modalActions}>
                <Button variant="outline" action="secondary" onPress={resetForm}>
                  <ButtonText>Cancelar</ButtonText>
                </Button>
                <Button action="primary" isDisabled={!text.trim()} onPress={handleSave}>
                  <ButtonText>Salvar</ButtonText>
                </Button>
              </View>
            </View>
          </View>
        </Modal>

        <Modal visible={aboutModalVisible} animationType="slide" onRequestClose={() => setAboutModalVisible(false)}>
          <AboutScreen onClose={() => setAboutModalVisible(false)} />
        </Modal>
        
        <ConfirmDeleteDialog
          isOpen={!!deleteTargetId}
          onClose={() => setDeleteTargetId(null)}
          onConfirm={() => {
            if (deleteTargetId) deleteTask(deleteTargetId, setTasks);
            setDeleteTargetId(null);
          }}
        />
        <StatusBar style="auto" />
      </SafeAreaView>
    </GluestackUIProvider>
  );
}

const styles = StyleSheet.create({
  headerContainer: { alignItems: 'center', marginTop: 16 },
  logo: { width: 60, height: 60, marginBottom: 8 },
  header: { textAlign: 'center', fontSize: 24, fontWeight: 'bold' },
  counterContainer: { marginTop: 8, flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  counterText: { fontSize: 16, color: '#666' },
  filterContainer: { flexDirection: 'row', justifyContent: 'center', gap: 8, marginTop: 12 },
  filterButton: { paddingVertical: 6, paddingHorizontal: 12, borderRadius: 16, borderWidth: 1 },
  filterButtonActive: { backgroundColor: '#000', borderColor: '#000' },
  filterButtonInactive: { backgroundColor: 'transparent', borderColor: '#000' },
  filterTextActive: { color: '#fff', fontSize: 14, fontWeight: 'bold' },
  filterTextInactive: { color: '#000', fontSize: 14 },
  actionButtonsContainer: { flexDirection: 'row', justifyContent: 'center', gap: 16, marginTop: 16 },
  aboutButtonContainer: { marginTop: 16, alignItems: 'center' },
  actionButton: { paddingVertical: 14, paddingHorizontal: 20, borderRadius: 8, justifyContent: 'center', alignItems: 'center', elevation: 3, shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.25, shadowRadius: 4, flex: 1 },
  actionButtonText: { color: '#fff', fontWeight: 'bold', fontSize: 14 },
  deleteButton: { backgroundColor: '#ff4d4d' },
  deleteButtonPressed: { backgroundColor: '#d9363e', transform: [{ scale: 0.98 }] },
  loaderContainer: { position: 'absolute', top: 0, bottom: 0, left: 0, right: 0, justifyContent: 'center', alignItems: 'center', backgroundColor: 'rgba(255, 255, 255, 0.7)', zIndex: 10 },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContent: { width: '90%', maxWidth: 400, backgroundColor: '#fff', borderRadius: 8, padding: 24, elevation: 5 },
  modalTitle: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, textAlign: 'center' },
  fieldRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 16 },
  fieldLabel: { fontSize: 16, fontWeight: 'bold' },
  checkboxContainer: { marginLeft: 16 },
  priorityContainer: { flexDirection: 'row', flex: 1, marginLeft: 16, gap: 8, flexWrap: 'wrap' },
  priorityButton: { paddingVertical: 6, paddingHorizontal: 10, borderRadius: 4, borderWidth: 1, borderColor: '#ccc' },
  priorityText: { color: '#333' },
  priorityTextActive: { color: '#fff', fontWeight: 'bold' },
  datePickerBtn: { borderWidth: 1, borderColor: '#ccc', paddingVertical: 8, paddingHorizontal: 12, borderRadius: 4 },
  modalActions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12, marginTop: 8 },
});