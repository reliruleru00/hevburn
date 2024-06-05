function deepClone(instance) {
    // インスタンスがnullまたはundefinedの場合、そのまま返す
    if (instance === null || instance === undefined) return instance;
  
    // プリミティブ型の場合、そのまま返す
    if (typeof instance !== 'object') return instance;
  
    // 特殊なオブジェクト型の場合
    if (instance instanceof Date) return new Date(instance);
    if (instance instanceof RegExp) return new RegExp(instance);
    if (instance instanceof Map) return new Map(instance);
    if (instance instanceof Set) return new Set(instance);
  
    // インスタンスがArrayの場合の処理
    if (Array.isArray(instance)) {
      return instance.map(item => deepClone(item));
    }
  
    // インスタンスのクラスを取得
    const ClonedClass = instance.constructor;
    // 新しいインスタンスを作成
    const clone = new ClonedClass();
  
    // プロパティを再帰的にコピー
    for (let key of Object.keys(instance)) {
      clone[key] = deepClone(instance[key]);
    }
  
    return clone;
  }
  