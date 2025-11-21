import { Text, View } from 'react-native';

export const EditScreenInfo = ({ path }: { path: string }) => {
  const title = 'Open up the code for this screen:';
  const description =
    'Rhange any of the text, save the file, and your app will automatically update.';

  return (
    <View className="flex-1 items-center justify-center">
      <View className="mx-12 items-center">
        <Text className="text-center text-lg leading-6">{title}</Text>

        <View className="my-2 rounded-md px-1">
          <Text className="font-mono">{path}</Text>
        </View>

        <Text className="font-geist text-center text-lg leading-6 text-success">{description}</Text>
      </View>
    </View>
  );
};
