<template>
  <div class="multi-select" ref="componentRoot">
    <input type="text" :value="selectedText" :title="selectedText" @click="toggleOption" readonly />

    <div v-if="visibleOption" class="multi-select-options-container">
      <div class="multi-select-option">
        <label>
          <input type="checkbox" v-model="checkAllState" @change="checkedAllState" />
          all
        </label>
      </div>
      <template v-for="item in selectItems">
        <div :key="item[itemKey]" class="multi-select-option">
          <label>
            <input
              type="checkbox"
              v-model="internalValue"
              :value="item[itemKey]"
              @change="emitValue"
            />
            {{item[itemLabel]}}
          </label>
        </div>
      </template>
    </div>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop, Watch, Emit } from "vue-property-decorator";

@Component
export default class MultiSelect extends Vue {
  @Prop({ required: true })
  value!: any[];
  @Prop({ required: true })
  selectItems!: any[];
  selectItemsMap: Map<any, any>;

  @Prop({ default: "value" })
  itemKey!: string;
  @Prop({ default: "text" })
  itemLabel!: string;

  visibleOption: boolean;
  internalValue: any[];
  checkAllState: boolean;

  constructor() {
    super();
    this.selectItemsMap = new Map<any, any>();

    this.visibleOption = false;
    this.internalValue = [];
    this.checkAllState = false;
  }

  @Watch("value")
  onChangeValue() {
    this.internalValue = this.value;
  }

  @Watch("selectItems", { immediate: true })
  onChangeSelectitems() {
    this.selectItemsMap = new Map<any, any>();
    for (let item of this.selectItems) {
      this.selectItemsMap.set(item[this.itemKey], item[this.itemLabel]);
    }

    //reflesh
    this.internalValue = this.internalValue.filter(item =>
      this.selectItemsMap.has(item)
    );
    this.emitValue();

    //allのつけなおし
    this.checkAllState = this.internalValue.length === this.selectItems.length;
  }

  @Emit("input")
  emitValue() {
    return this.internalValue;
  }

  //-----------
  //lifecycle

  beforeDestroy() {
    this.hide();
  }

  //-----------
  //methods

  /**
   * 選択肢の表示切り替え
   */
  toggleOption() {
    if (this.visibleOption) {
      this.hide();
    } else {
      this.visibleOption = true;
      document.addEventListener("click", this.handleClick, true);
    }
  }

  /**
   * 選択肢の一覧を隠す
   */
  hide() {
    if (this.visibleOption) {
      this.visibleOption = false;
      document.removeEventListener("click", this.handleClick, true);
    }
  }

  /**
   * クリック
   */
  handleClick(ev: MouseEvent) {
    if (this.isOutSide(ev.target as Node)) {
      //対象外の領域をクリックされたら閉じる
      this.hide();
    }
  }

  /**
   * 外側をクリックしたら閉じたいのでその判定
   */
  isOutSide(eventTarget: Node) {
    for (let t: Node | null = eventTarget; t; t = t.parentNode) {
      if (t === this.$refs.componentRoot) {
        return false;
      }
    }
    return true;
  }

  /**
   * allのチェック切り替え時
   */
  checkedAllState() {
    if (this.checkAllState) {
      this.internalValue = this.selectItems.map(item => item[this.itemKey]);
    } else {
      this.internalValue = [];
    }
    this.emitValue();
  }

  /**
   * 選択内容のラベルを繋げたもの
   */
  get selectedText() {
    return this.internalValue.map(v => this.selectItemsMap.get(v)).join(", ");
  }
}
</script>

<style lang="sass" scoped>
div.multi-select
  position: relative
  input
    cursor: pointer

  div.multi-select-options-container
    position: absolute
    top: 2rem
    z-index: 1
    overflow-x: auto
    max-width: 30rem
    max-height: 15rem

    background-color: white
    box-shadow: 0 0 2px 0 rgba(0, 0, 0, 0.3)

    height: 10rem
    div.multi-select-option
      display: flex
      flex-direction: column
      > label
        padding: 0.33rem 1rem 0.33rem 0.33rem

</style>