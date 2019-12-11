<template>
	<div class="table-page">
		<el-table :data="table.tableData" border @sort-change="table.sortevent" :loading="loading" style="width: 100%;">
			<template v-for="(item,index) in table.thead">
                <!-- 多选框 -->
                <el-table-column type="selection" :width="item.width" v-if="item.type == 'selection'" :key="index"></el-table-column>
                <!-- 显示图片 -->
                <el-table-column :prop="item.attr" :fixed="item.fixed" :label="item.label" :width="item.width" v-else-if="item.type == 'img'" :key="index">
                    <template slot-scope="scope">
                        <el-image :style="{width: scope.row[item.width]+'px',height:scope.row[item.height]+'px'}" :src="scope.row[item.attr]" :fit="scope.row[item.fit]"></el-image>
                    </template>
                </el-table-column>
                <!-- 预览图片 -->
                <el-table-column :prop="item.attr" :fixed="item.fixed" :label="item.label" :width="item.width" v-else-if="item.type == 'popimg'" :key="index">
                    <template slot-scope="scope">
                        <el-popover :placement="scope.row[item.placement]" :trigger="scope.row[item.trigger]">
                            <el-image :src="scope.row[item.attr]" :fit="scope.row[item.fit]"></el-image>
                            <el-image :style="{width: scope.row[item.width]+'px',height:scope.row[item.height]+'px'}" :src="scope.row[item.attr]" :fit="scope.row[item.fit]" slot="reference"></el-image>
                        </el-popover>
                    </template>
                </el-table-column>
                <!-- 操作按钮 -->
				<el-table-column align="center" fixed="right" :width="item.width" :label="item.label" v-else-if="item.buttons" :key="index">
					<template slot-scope="scope">
						<template v-for="(btn,index_) in item.buttons">
                            <!-- element-ui的朴素按钮 -->
                            <template v-if="btn.plain">
                                <el-button :type="btn.type" :size="btn.size" :icon="btn.icon" @click="btn.event(scope.row)" plain :key="index_" v-if="btn.show ? btn.show(scope.row) : true">{{btn.label}}</el-button>
                            </template>
                            <!-- element-ui的圆角按钮 -->
                            <template v-else-if="btn.round">
                                <el-button :type="btn.type" :size="btn.size" :icon="btn.icon" @click="btn.event(scope.row)" round :key="index_" v-if="btn.show ? btn.show(scope.row) : true">{{btn.label}}</el-button>
                            </template>
                            <!-- element-ui的圆形按钮 -->
                            <template v-else-if="btn.circle">
                                <el-button :type="btn.type" :size="btn.size" :icon="btn.icon" @click="btn.event(scope.row)" circle :key="index_" v-if="btn.show ? btn.show(scope.row) : true"></el-button>
                            </template>
                            <!-- element-ui的默认按钮 -->
                            <template v-else>
                                <el-button :type="btn.type" :size="btn.size" :icon="btn.icon" @click="btn.event(scope.row)" :key="index_" v-if="btn.show ? btn.show(scope.row) : true">{{btn.label}}</el-button>
                            </template>
                        </template>
					</template>
				</el-table-column>
				<el-table-column :sortable="item.sort" align="center" :prop="item.attr" :fixed="item.fixed" :width="item.width" :formatter="item.formatter" :label="item.label" :show-overflow-tooltip="item.showOverflowTooltip" v-else :key="index">
				</el-table-column>
			</template>
		</el-table>
        <!-- 分页数据 -->
        <el-pagination @size-change="page.sizeChange" @current-change="page.currentChange" :current-page="page.currentPage" prev-text="上一页" next-text="下一页" :page-sizes="page.pageSizes" :page-size="page.pageSize" :pager-count="5" layout="sizes, total, prev, pager, next, jumper" :total="page.total" v-if="table.tableData.length > 0">
		</el-pagination>
	</div>
</template>
<script>
	export default {
		props: {
            table: Object,
            page: Object,
			loading: Boolean
		}
	}
</script>
<style scoped>
</style>