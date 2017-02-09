<?php
class Folder_Model_Folder extends Core_Model_Default {

    protected $_is_cacheable = true;
    protected $_root_category;

    public function __construct($params = array()) {
        parent::__construct($params);
        $this->_db_table = 'Folder_Model_Db_Table_Folder';
        return $this;
    }

    /**
     * @return array
     */
    public function getInappStates($value_id) {

        $in_app_states = array(
            array(
                "state" => "folder-category-list",
                "offline" => true,
                "params" => array(
                    "value_id" => $value_id,
                ),
            ),
        );

        return $in_app_states;
    }

    public function deleteFeature() {

        if(!$this->getId()) {
            return $this;
        }

        $this->getRootCategory()->delete();

        return $this->delete();
    }

    public function getRootCategory() {

        if(!$this->_root_category) {
            $this->_root_category = new Folder_Model_Category();
            $this->_root_category->find($this->getRootCategoryId());
        }

        return $this->_root_category;

    }

    public function getFeaturePaths($option_value) {
        if(!$this->isCacheable()) return array();

        $paths = array();
        $paths[] = $option_value->getPath("findall", array('value_id' => $option_value->getId()), false);

        $paths = array_merge($paths, $this->_get_subcategories_feature_paths($this->getRootCategory(), $option_value));

        return $paths;
    }


    public function getAssetsPaths($option_value) {
        if(!$this->isCacheable()) return array();

        $paths = array();

        $folder = $option_value->getObject();

        if($folder->getId()) {
            $category = new Folder_Model_Category();
            $category->find($folder->getRootCategoryId(), "category_id");
            if($category->getId()) {
                $paths[] = $category->getPictureUrl();
                $paths = array_merge($paths, $this->_get_subcategories_assets_paths($category));
            }
        }

        return $paths;
    }

    private function _get_subcategories_feature_paths($category, $option_value) {
        $paths = array();
        $subcategories = $category->getChildren();

        foreach($subcategories as $subcategory) {
            $params = array(
                "value_id" => $option_value->getId(),
                "category_id" => $subcategory->getId()
            );
            $paths[] = $option_value->getPath("findall", $params, false);
            $paths = array_merge($paths, $this->_get_subcategories_feature_paths($subcategory, $option_value));
        }

        return $paths;
    }

    private function _get_subcategories_assets_paths($category) {
        $paths = array();

        if(is_object($category) && $category->getId()) {
            $subs = $category->getChildren();
            foreach($subs as $subcat) {
                $paths[] = $subcat->getPictureUrl();
                $paths = array_merge($paths, $this->_get_subcategories_assets_paths($subcat));
            }
        }

        return $paths;
    }

    public function createDummyContents($option_value, $design, $category) {

        $dummy_content_xml = $this->_getDummyXml($design, $category);

        foreach ($dummy_content_xml->folders->folder as $folder) {
            $root_category = new Folder_Model_Category();
            $root_category->addData((array) $folder->category->main->content)
                ->save()
            ;

            if($folder->category->main->features) {
                $i = 1;
                foreach ($folder->category->main->features->feature as $feature) {
                    $option = new Application_Model_Option();
                    $option->find((string) $feature->code, "code")->getObject();

                    $option_value_obj = new Application_Model_Option_Value();

                    $icon_id = NULL;
                    if((string)$feature->icon) {
                        $icon = new Media_Model_Library_Image();
                        $icon->find((string)$feature->icon, "link");

                        if (!$icon->getData()) {
                            $icon->setLibraryId($option->getLibraryId())
                                ->setLink((string)$feature->icon)
                                ->setOptionId($option->getId())
                                ->setCanBeColorized($feature->colorizable ? (string)$feature->colorizable : 1)
                                ->setPosition(0)
                                ->save()
                            ;
                        }

                        $icon_id = $icon->getId();
                    }

                    $datas = array(
                        "tabbar_name" => (string)$feature->name ? (string)$feature->name : NULL,
                        "icon_id" => $icon_id,
                        "app_id" => $this->getApplication()->getId(),
                        "option_id" => $option->getId(),
                        "layout_id" => $this->getApplication()->getLayout()->getId(),
                        "folder_id" => $option_value->getId(),
                        "folder_category_id" => $root_category->getId(),
                        "folder_category_position" => $i++
                    );

                    $option_value_obj->addData($datas)
                        ->save()
                    ;

                }
            }

            $this->unsData();
            $this->setValueId($option_value->getId())
                ->setRootCategoryId($root_category->getId())
                ->save()
            ;

            foreach ($folder->category->subcategory as $subcategory) {
                $sub_root_category = new Folder_Model_Category();
                $sub_root_category->addData((array) $subcategory->content)
                    ->setParentId($root_category->getId())
                    ->save()
                ;

                if($folder->category->subcategory->features) {
                    $i = 1;
                    foreach ($folder->category->subcategory->features->children() as $feature) {

                        $option = new Application_Model_Option();
                        $option->find((string)$feature->code, "code")->getObject();

                        $option_value_obj = new Application_Model_Option_Value();

                        $icon_id = NULL;
                        if((string)$feature->icon) {
                            $icon = new Media_Model_Library_Image();
                            $icon->find((string)$feature->icon, "link");

                            if (!$icon->getData()) {
                                $icon->setLibraryId($option->getLibraryId())
                                    ->setLink((string)$feature->icon)
                                    ->setOptionId($option->getId())
                                    ->setCanBeColorized(1)
                                    ->setPosition(0)
                                    ->save()
                                ;
                            }

                            $icon_id = $icon->getId();
                        }

                        $datas = array(
                            "tabbar_name" => (string)$feature->name ? (string)$feature->name : NULL,
                            "icon_id" => $icon_id,
                            "app_id" => $this->getApplication()->getId(),
                            "option_id" => $option->getId(),
                            "layout_id" => $this->getApplication()->getLayout()->getId(),
                            "folder_id" => $option_value->getId(),
                            "folder_category_id" => $sub_root_category->getId(),
                            "folder_category_position" => $i++
                        );

                        $option_value_obj->addData($datas)
                            ->save()
                        ;

                    }
                }
            }
        }
    }

    public function copyTo($option) {

        $root_category = new Folder_Model_Category();
        $root_category->find($this->getRootCategoryId());

        $this->copyCategoryTo($option, $root_category);

        $this->setId(null)
            ->setValueId($option->getId())
            ->setRootCategoryId($root_category->getId())
            ->save()
        ;

        return $this;
    }

    public function copyCategoryTo($option, $category, $parent_id = null) {

        $children = $category->getChildren();
        $category_option = new Application_Model_Option_Value();
        $option_values = $category_option->findAll(array('app_id' => $option->getAppId(), 'folder_category_id' => $category->getId()), array('folder_category_position ASC'));
        $category->setId(null)->setParentId($parent_id)->save();

        foreach($option_values as $option_value) {
            $option_value->setFolderCategoryId($category->getId())->save();
        }

        foreach($children as $child) {
            $this->copyCategoryTo($option, $child, $category->getId());
        }

        return $this;

    }

}
