import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { Header } from '@/components/ui/Header';
import { Card } from '@/components/ui/Card';
import { Send, Mic, Bot, User, TriangleAlert as AlertTriangle, CircleCheck as CheckCircle, Clock } from 'lucide-react-native';

interface Message {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  type?: 'warning' | 'success' | 'info';
}

export default function AIChat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      text: 'Hello! I\'m your AI health assistant. I can help you understand symptoms, suggest medications, and provide health guidance. How are you feeling today?',
      isUser: false,
      timestamp: new Date(),
      type: 'info'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  const sendMessage = () => {
    if (inputText.trim()) {
      const userMessage: Message = {
        id: Date.now().toString(),
        text: inputText,
        isUser: true,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, userMessage]);
      setInputText('');
      setIsTyping(true);

      // Simulate AI response
      setTimeout(() => {
        const aiResponse: Message = {
          id: (Date.now() + 1).toString(),
          text: getAIResponse(inputText),
          isUser: false,
          timestamp: new Date(),
          type: inputText.toLowerCase().includes('pain') ? 'warning' : 'info'
        };
        setMessages(prev => [...prev, aiResponse]);
        setIsTyping(false);
      }, 2000);
    }
  };

  const getAIResponse = (input: string): string => {
    const lowerInput = input.toLowerCase();
    
    if (lowerInput.includes('headache') || lowerInput.includes('head pain')) {
      return 'I understand you\'re experiencing a headache. This could be due to dehydration, stress, or tension. Try drinking water, resting in a dark room, and applying a cold compress. If the pain persists or worsens, consider seeing a doctor. Would you like me to find nearby pharmacies for pain relief medication?';
    }
    
    if (lowerInput.includes('fever') || lowerInput.includes('temperature')) {
      return 'A fever can indicate your body is fighting an infection. Stay hydrated, rest, and monitor your temperature. If it exceeds 38.5°C (101.3°F) or persists for more than 3 days, seek medical attention. I can help you find the nearest clinic if needed.';
    }
    
    if (lowerInput.includes('cough')) {
      return 'Coughing can be caused by various factors including allergies, infections, or irritants. Stay hydrated, use honey for throat soothing, and avoid smoke. If accompanied by fever, difficulty breathing, or blood, seek immediate medical care. Would you like recommendations for cough medications available nearby?';
    }
    
    return 'Thank you for sharing that with me. Based on what you\'ve described, I recommend monitoring your symptoms closely. If you experience any worsening or concerning symptoms, please don\'t hesitate to seek medical attention. I can help you find nearby healthcare facilities or provide more specific guidance if you share additional details.';
  };

  const renderMessage = (message: Message) => (
    <View key={message.id} style={[
      styles.messageContainer,
      message.isUser ? styles.userMessage : styles.aiMessage
    ]}>
      <View style={styles.messageHeader}>
        <View style={styles.messageIcon}>
          {message.isUser ? (
            <User size={16} color="#FFFFFF" />
          ) : (
            <Bot size={16} color="#2563EB" />
          )}
        </View>
        <Text style={styles.messageTime}>
          {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </Text>
      </View>
      
      <View style={[
        styles.messageBubble,
        message.isUser ? styles.userBubble : styles.aiBubble,
        message.type === 'warning' && styles.warningBubble
      ]}>
        {message.type === 'warning' && (
          <View style={styles.messageTypeIcon}>
            <AlertTriangle size={16} color="#F59E0B" />
          </View>
        )}
        <Text style={[
          styles.messageText,
          message.isUser ? styles.userText : styles.aiText
        ]}>
          {message.text}
        </Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      <Header title="AI Health Assistant" subtitle="Get instant health guidance" />
      
      <KeyboardAvoidingView 
        style={styles.content}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView 
          style={styles.messagesContainer}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.messagesContent}
        >
          {messages.map(renderMessage)}
          
          {isTyping && (
            <View style={[styles.messageContainer, styles.aiMessage]}>
              <View style={styles.messageHeader}>
                <View style={styles.messageIcon}>
                  <Bot size={16} color="#2563EB" />
                </View>
                <Text style={styles.messageTime}>Now</Text>
              </View>
              <View style={[styles.messageBubble, styles.aiBubble]}>
                <View style={styles.typingIndicator}>
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                  <View style={styles.typingDot} />
                </View>
              </View>
            </View>
          )}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>I have a headache</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Feeling feverish</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Stomach pain</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.quickActionButton}>
              <Text style={styles.quickActionText}>Cough symptoms</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>

        {/* Input Area */}
        <View style={styles.inputContainer}>
          <View style={styles.inputWrapper}>
            <TextInput
              style={styles.textInput}
              placeholder="Describe your symptoms..."
              value={inputText}
              onChangeText={setInputText}
              multiline
              maxLength={500}
            />
            <TouchableOpacity style={styles.micButton}>
              <Mic size={20} color="#666666" />
            </TouchableOpacity>
          </View>
          <TouchableOpacity 
            style={[styles.sendButton, !inputText.trim() && styles.sendButtonDisabled]}
            onPress={sendMessage}
            disabled={!inputText.trim()}
          >
            <Send size={20} color="#FFFFFF" />
          </TouchableOpacity>
        </View>

        {/* Disclaimer */}
        <View style={styles.disclaimer}>
          <AlertTriangle size={16} color="#F59E0B" />
          <Text style={styles.disclaimerText}>
            This AI assistant provides general health information only. Always consult healthcare professionals for medical advice.
          </Text>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8F9FA',
  },
  content: {
    flex: 1,
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 20,
  },
  messagesContent: {
    paddingVertical: 16,
  },
  messageContainer: {
    marginBottom: 16,
  },
  userMessage: {
    alignItems: 'flex-end',
  },
  aiMessage: {
    alignItems: 'flex-start',
  },
  messageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  messageIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 8,
  },
  messageTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#999999',
  },
  messageBubble: {
    maxWidth: '80%',
    padding: 16,
    borderRadius: 20,
  },
  userBubble: {
    backgroundColor: '#2563EB',
    borderBottomRightRadius: 8,
  },
  aiBubble: {
    backgroundColor: '#FFFFFF',
    borderBottomLeftRadius: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  warningBubble: {
    borderColor: '#F59E0B',
    borderWidth: 2,
  },
  messageTypeIcon: {
    marginBottom: 8,
  },
  messageText: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    lineHeight: 22,
  },
  userText: {
    color: '#FFFFFF',
  },
  aiText: {
    color: '#1C1C1E',
  },
  typingIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  typingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#2563EB',
    marginRight: 4,
    opacity: 0.6,
  },
  quickActions: {
    paddingHorizontal: 20,
    paddingVertical: 12,
  },
  quickActionButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#E5E5EA',
  },
  quickActionText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2563EB',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  inputWrapper: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: '#F8F9FA',
    borderRadius: 24,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginRight: 12,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#1C1C1E',
    maxHeight: 80,
  },
  micButton: {
    padding: 4,
    marginLeft: 8,
  },
  sendButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563EB',
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendButtonDisabled: {
    backgroundColor: '#E5E5EA',
  },
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    backgroundColor: '#FEF3C7',
    marginHorizontal: 20,
    marginBottom: 12,
    borderRadius: 12,
  },
  disclaimerText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#92400E',
    marginLeft: 8,
    flex: 1,
  },
});