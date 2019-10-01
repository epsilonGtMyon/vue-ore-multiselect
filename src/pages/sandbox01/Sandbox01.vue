<template>
  <div>
    <MultiSelect v-model="selected" :selectItems="selectItems" />
    {{selected}}
    <button @click="refleshItem">refleshItem</button>
  </div>
</template>

<script lang="ts">
import { Component, Vue } from "vue-property-decorator";
import MultiSelect from "@/components/MultiSelect.vue"; // @ is an alias to /src

type SelectItem = {
  value: string;
  text: string;
};
@Component({
  components: {
    MultiSelect
  }
})
export default class Sandbox01 extends Vue {
  selected: string[];
  selectItems: SelectItem[];

  constructor() {
    super();
    this.selected = [];
    this.selectItems = createItems();
  }

  refleshItem() {
    const selectItems: SelectItem[] = [];
    const begin = Math.floor(Math.random() * 5);
    const end = begin + Math.floor(Math.random() * 5) + 3;
    for (let i = begin; i <= end; i++) {
      selectItems.push({
        value: `${i}`,
        text: `value-${i}`
      });
    }

    this.selectItems = selectItems;
  }
}

function createItems() {
  const items: SelectItem[] = [];
  for (let i = 1; i <= 10; i++) {
    items.push({
      value: `${i}`,
      text: `value-${i}`
    });
  }
  return items;
}
</script>