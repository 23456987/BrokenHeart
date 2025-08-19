import React, { useLayoutEffect } from 'react';
import { View, StyleSheet } from 'react-native';
import { WebView } from 'react-native-webview';

export default function PageScreen({ route, navigation }) {
  const { title, content } = route.params;

  useLayoutEffect(() => {
    navigation.setOptions({ title });
  }, [navigation, title]);

  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <style>
          body {
            background-color: #000;
            color: #f0f0f0;
            font-family: 'Segoe UI', Roboto, 'Helvetica Neue', sans-serif;
            padding: 24px;
            margin: 0;
            font-size: 17px;
            line-height: 1.8;
          }

          .card {
            background-color: #111;
            border-radius: 16px;
            padding: 24px;
            box-shadow: 0 8px 20px rgba(255, 255, 255, 0.05);
            transition: all 0.3s ease;
          }

          h1, h2, h3 {
            color: #fff;
            margin-bottom: 12px;
            margin-top: 24px;
          }

          p {
            color: #ccc;
            margin-bottom: 16px;
          }

          li {
            color: #bbb;
            margin-bottom: 8px;
          }

          ul {
            padding-left: 20px;
            margin-bottom: 16px;
          }

          a {
            color: #1e90ff;
            text-decoration: none;
            transition: color 0.3s;
          }

          a:hover {
            color: #63b3ed;
          }

          strong {
            color: #fff;
          }

          blockquote {
            border-left: 4px solid #444;
            padding-left: 16px;
            margin-left: 0;
            color: #aaa;
            font-style: italic;
            margin-top: 16px;
            margin-bottom: 16px;
          }
        </style>
      </head>
      <body>
        <div class="card">
          ${content}
        </div>
      </body>
    </html>
  
`
  return (
    <View style={styles.container}>
      <WebView
        originWhitelist={['*']}
        source={{ html: htmlContent }}
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
});
