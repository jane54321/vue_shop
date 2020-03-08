import Vue from 'vue'
import VueQuillEditor from 'vue-quill-editor'

// 导入富文本编辑器对应的样式
// 生产环境下不引用，使用外部加载
if (process.env.NODE_ENV === 'development') {
    import ('quill/dist/quill.core.css');
    import ('quill/dist/quill.snow.css');
    import ('quill/dist/quill.bubble.css');
}

Vue.use(VueQuillEditor);
