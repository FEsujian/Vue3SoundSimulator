<template>
  <div class="app">
    <div class="container">
      <div class="flex items-center justify-center pb-2">
        <div class="text-4xl font-bold">声音模拟器</div>
      </div>
      <div class="flex items-center justify-center pb-5">
        <label class="flex items-center mr-4">
          <span class="mr-2 text-xl">循环播放</span>
          <input type="checkbox" v-model="isLooping" class="w-[20px] h-[20px]" />
          <span class="toggle-label"></span>
        </label>
        <label class="flex items-center">
          <span class="mr-2 text-xl">播放多个</span>
          <input type="checkbox" v-model="isMultiple" class="w-[20px] h-[20px]" />
          <span class="toggle-label"></span>
        </label>
      </div>
      <!-- Tabs with "All" option -->
      <div class="tabs-wrapper">
        <div class="tabs">
          <button :class="{ active: activeTab === -1 }" @click="activeTab = -1">
            全部
          </button>
          <button v-for="(label, index) in LABELS" :key="label.id" :class="{ active: activeTab === index }"
            @click="activeTab = index">
            {{ label.name }}
          </button>
        </div>
      </div>

      <!-- Sounds grid -->
      <div class="sounds-grid">
        <div v-for="sound in filteredSounds" :key="sound.id" class="sound-item"
          :class="{ playing: currentPlayingIds.includes(sound.id) }" @click="togglePlaySound(sound.id)">
          <div class="image">{{ sound.image }}</div>
          <div class="name">{{ sound.name }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { LABELS, SOUND_DATA } from './data.js'; // 从 data.js 引入数据

// 创建音频路径映射
const audioPaths = {};
SOUND_DATA.forEach(sound => {
  audioPaths[sound.id] = new URL(`./assets/sounds/${sound.id}.mp3`, import.meta.url).href;
});

const activeTab = ref(-1); // 默认 -1 表示 "全部"
const currentPlayingIds = ref([]); // 当前正在播放的音频 ID 数组
const audioInstances = ref({}); // 用于保存音频实例
const isLooping = ref(false); // 循环播放开关
const isMultiple = ref(false); // 播放多个开关

// 过滤声音，基于选择的标签
const filteredSounds = computed(() => {
  // 如果 "全部" 被选中，返回所有声音
  if (activeTab.value === -1) {
    return SOUND_DATA;
  }
  // 否则返回与标签匹配的声音
  const activeLabel = LABELS[activeTab.value].id;
  return SOUND_DATA.filter(sound => sound.labels.includes(activeLabel));
});

// 切换播放状态的函数
const togglePlaySound = (id) => {
  // 如果已经在播放，则停止当前音频
  if (currentPlayingIds.value.includes(id)) {
    stopPlaying(id);
  } else {
    if (isMultiple.value) {
      // 如果允许多个播放，播放新音频
      playSound(id);
    } else {
      // 如果不允许多个播放，则停止所有并播放新音频
      stopAllSounds();
      playSound(id);
    }
  }
};

// 播放声音函数，使用本地路径
const playSound = (id) => {
  const src = audioPaths[id]; // 获取本地音频路径
  const audio = new Audio(src);
  audio.loop = isLooping.value; // 根据循环播放开关设置

  audio.onerror = () => {
    console.error("音频加载失败，无法播放音频文件: ", src);
  };

  currentPlayingIds.value.push(id); // 添加到正在播放的 ID 数组
  audioInstances.value[id] = audio; // 保存音频实例

  audio.play().catch((error) => {
    console.error("音频播放失败: ", error);
  });

  // 在音频结束时移除 ID
  audio.onended = () => {
    if (!isLooping.value) {
      stopPlaying(id); // 如果不是循环播放，则停止
    }
  };
};

// 停止播放
const stopPlaying = (id) => {
  currentPlayingIds.value = currentPlayingIds.value.filter(currentId => currentId !== id);
  if (audioInstances.value[id]) {
    audioInstances.value[id].pause(); // 停止音频
    delete audioInstances.value[id]; // 删除实例
  }
};

// 停止所有声音
const stopAllSounds = () => {
  currentPlayingIds.value.forEach(id => stopPlaying(id));
  currentPlayingIds.value = []; // 清空正在播放的 ID 数组
};

</script>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: #A7CBFD;
}

.container {
  width: 100%;
  padding: 20px;

  min-height: 100vh;
  color: #4f4c4c;

}

.tabs-wrapper {
  overflow-x: auto;
  /* Allow horizontal scrolling */
  white-space: nowrap;
  /* Prevent wrapping */
  margin-bottom: 20px;
  -ms-overflow-style: none;
  /* Hide scrollbar in IE and Edge */
  scrollbar-width: none;
  /* Hide scrollbar in Firefox */
}

.tabs-wrapper::-webkit-scrollbar {
  display: none;
  /* Hide scrollbar in Chrome, Safari, and Opera */
}

.tabs {
  display: inline-flex;
  /* Ensure tabs are displayed in a row */
}

.tabs button {
  background-color: #f5f5f5;
  border: none;
  padding: 10px 20px;
  cursor: pointer;
  font-size: 16px;
  border-radius: 5px;
  margin-right: 10px;
  /* Space between tabs */
  white-space: nowrap;
  /* Prevent button text from wrapping */
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  border: 2px solid #cfef00;
}

.tabs button.active {
  background-color: #cfef00;
  /* color: white; */
}

.sounds-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 15px;
}

.sound-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #fff;
  padding: 10px;
  border-radius: 15px;
  box-shadow: 0px 4px 8px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  max-width: 100%;
  overflow: hidden;
  border: 2px solid #cfef00;
}

.sound-item:hover {
  background-color: #ddd;
}

/* 边框动效 */
.sound-item.playing {
  border: 2px solid #286fe2;
  /* 播放时的边框颜色 */
  animation: pulse 1s infinite;
  /* 动效 */
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }

  50% {
    transform: scale(1.05);
  }

  100% {
    transform: scale(1);
  }
}

.image {
  font-size: 40px;
}

.name {
  margin-top: 10px;
  font-size: 14px;
  text-align: center;
}
</style>
