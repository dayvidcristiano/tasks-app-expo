import React from 'react';
import {
  AlertDialog,
  AlertDialogBackdrop,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@/components/ui/alert-dialog';
import { Heading } from '@/components/ui/heading';
import { Text } from '@/components/ui/text';
import { Button, ButtonText } from '@/components/ui/button';

interface ConfirmDeleteDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ConfirmDeleteDialog({ isOpen, onClose, onConfirm }: ConfirmDeleteDialogProps) {
  return (
    <AlertDialog isOpen={isOpen} onClose={onClose}>
      <AlertDialogBackdrop />
      <AlertDialogContent>
        <AlertDialogHeader>
          <Heading size="md">Excluir tarefa</Heading>
        </AlertDialogHeader>
        <AlertDialogBody>
          <Text size="sm">Tem certeza que deseja excluir esta tarefa?</Text>
        </AlertDialogBody>
        <AlertDialogFooter className="gap-3">
          <Button variant="outline" action="secondary" onPress={onClose}>
            <ButtonText>Cancelar</ButtonText>
          </Button>
          <Button action="negative" onPress={onConfirm}>
            <ButtonText>Excluir</ButtonText>
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}