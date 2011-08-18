class ActivityStreams::NotesController < BaseController

  respond_to :json 

  def create
    activity = params[:activity]
    @note = ActivityStreams::Note.from_activity(activity)

    @note.author = current_user.person 
    @note.public = true
    @note.save
    render :nothing =>true, :code => 200
  end

#   {activity: {
# "published": "2011-02-10T15:04:55Z",
# "actor": {
# "url": "http://example.org/martin",
# "objectType" : "person",
# "id": "tag:example.org,2011:martin",
# "image": {
# "url": "http://example.org/martin/image",
# "width": 250,
# "height": 250
# },
# "displayName": "Martin Smith"
# },
# "verb": "post",
# "object" : {
# "url": "http://example.org/blog/2011/02/entry",
# "id": "tag:example.org,2011:abc123/xyz" <== this is the permalink to the post, also
# "content":"the html content of the post",
# "type": 'article',
# "displayName": "title with shortlink"

# },
# "target" : {
#   "url": "http://example.org/blog/", <== root of the blog
#   "objectType": "blog",
#   "id": "tag:example.org,2011:abc123", < == also root of the blog
#   "displayName": "Martin's Blog"
# }
# }
# }
end
