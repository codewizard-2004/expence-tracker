import { MaterialIcons } from '@expo/vector-icons';
import React from 'react';
import { ActivityIndicator, Text, View } from 'react-native';

type VerticalStepperProps = {
  steps: string[];
  currentStepIndex: number;
};

const VerticalStepper = ({ steps, currentStepIndex }: VerticalStepperProps) => {
  return (
    <View 
      className="bg-surface-container-low rounded-[24px] p-6 border w-full mb-6"
      style={{
        borderColor: 'rgba(204, 195, 216, 0.1)',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 2,
        elevation: 2,
      }}
    >
      <Text className="font-headline font-bold text-lg text-on-surface mb-6">
        Processing Receipt...
      </Text>
      
      <View className="relative">
        <View className="absolute left-[15px] top-4 bottom-4 w-0.5" style={{ backgroundColor: 'rgba(204, 195, 216, 0.3)' }} />

        {steps.map((step, index) => {
          const isActive = index === currentStepIndex;
          const isCompleted = index < currentStepIndex;
          const isPending = index > currentStepIndex;

          return (
            <View key={index} className="flex-row items-start mb-8 last:mb-0 relative z-10">
              <View className="items-center mr-4">
                {isCompleted ? (
                  <View className="w-8 h-8 rounded-full bg-[#7C3AED] items-center justify-center border-[3px] border-surface-container-low">
                    <MaterialIcons name="check" size={16} color="white" />
                  </View>
                ) : isActive ? (
                  <View 
                    className="w-8 h-8 rounded-full bg-[#630ED4] items-center justify-center border-[3px] border-surface-container-low"
                    style={{
                      shadowColor: '#630ED4',
                      shadowOffset: { width: 0, height: 2 },
                      shadowOpacity: 0.3,
                      shadowRadius: 4,
                      elevation: 3,
                    }}
                  >
                    <ActivityIndicator size="small" color="white" />
                  </View>
                ) : (
                  <View 
                    className="w-8 h-8 rounded-full bg-surface-container-highest items-center justify-center border-2"
                    style={{ borderColor: 'rgba(204, 195, 216, 0.3)' }}
                  >
                    <Text className="text-on-surface-variant font-body text-xs font-bold">
                      {index + 1}
                    </Text>
                  </View>
                )}
                
                {index < steps.length - 1 && isCompleted && (
                  <View className="absolute top-[30px] left-1/2 ml-[-1px] w-0.5 h-[36px] bg-[#7C3AED]" />
                )}
              </View>

              <View className="flex-1 mt-1">
                <Text
                  className={`font-headline font-bold text-base ${
                    isActive
                      ? 'text-[#630ED4]'
                      : isCompleted
                      ? 'text-on-surface'
                      : 'text-on-surface-variant'
                  }`}
                >
                  {step}
                </Text>
                {isActive && (
                  <Text className="font-body text-xs text-on-surface-variant mt-1 leading-relaxed">
                    Please wait while our AI analyzes this document.
                  </Text>
                )}
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default VerticalStepper;
