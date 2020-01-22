import mongoose from 'mongoose';
import mongoosePaginate from 'mongoose-paginate'

if (process.env.MONGODB_DEBUG) {
  mongoose.set('debug', true)
}

mongoose.plugin(mongoosePaginate)
// mongoose.plugin(require('./plugins/findOrFail'))
// mongoose.plugin(require('./plugins/firstOrFail'))
// mongoose.plugin(require('./plugins/findByObjectIdOrSlug'))
// mongoose.plugin(require('./plugins/findByObjectIdOrKey'))
mongoose.plugin(require('./plugins/tranformRemoveHiddenFields'))

export default mongoose
