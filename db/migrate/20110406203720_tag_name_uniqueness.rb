class TagNameUniqueness < ActiveRecord::Migration
  def self.downcase_tags
    execute <<SQL
      UPDATE tags
      SET name = LOWER(name)
      WHERE name != LOWER(name)
SQL
  end
  def self.consolidate_duplicate_tags
    duplicate_rows = execute <<SQL
    SELECT count(name), name FROM tags
      GROUP BY name
        HAVING COUNT(*) > 1
SQL
    duplicate_rows.each do |row|
      name = row.last
      tag_ids = execute("SELECT tags.id FROM tags WHERE tags.name = '#{name}'").to_a.flatten!
      id_to_keep = tag_ids.pop
      execute <<SQL
              UPDATE IGNORE taggings
                SET tag_id = #{id_to_keep}
                WHERE tag_id IN (#{tag_ids.join(',')})
SQL
      execute <<SQL
        DELETE FROM taggings WHERE tag_id IN (#{tag_ids.join(',')})
SQL

      execute("DELETE FROM tags WHERE id IN (#{tag_ids.join(',')})")
    end
  end

  def self.up
    downcase_tags
    consolidate_duplicate_tags
    add_index :tags, :name, :unique => true
  end

  def self.down
    raise ActiveRecord::IrreversibleMigration.new
  end
end
