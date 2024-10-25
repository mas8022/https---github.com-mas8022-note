const { getDefaultConfig } = require("metro-config");

module.exports = (async () => {
  const {
    resolver: { sourceExts, assetExts },
  } = await getDefaultConfig.getDefaultValues(
    // اطمینان از استفاده از `react-native` برای Metro
    'react-native'
  );

  return {
    transformer: {
      assetPlugins: ['expo-asset/tools/hashAssetFiles'],
    },
    resolver: {
      assetExts: assetExts.filter(ext => ext !== 'db'), // حذف db از assetExts اگر نیاز باشد
      sourceExts: [...sourceExts, 'cjs'], // اضافه کردن cjs به sourceExts
    },
  };
})();
