from selenium import webdriver
# from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options
import unittest
import time
from selenium.webdriver.common.keys import Keys

# NOTE: You may need to download geckodriver, if you are using linux and haven't already dowloaded it


class TestNewVisitor(unittest.TestCase):
    def setUp(self):
        options = Options()
        options.add_argument("--headless")
        self.browser = webdriver.Firefox(options=options)
        self.browser.get('http://localhost:8009/')

    def tearDown(self):
        self.browser.quit()

    def test_can_make_super_simple_diagram(self):
        # Edith wants to make a super simple diagram to of her iPhone and active monitors.
        # Someone gives her a link to our site
        # self.browser.get('http://localhost:8009/')

        # She notices the page title and header mention to-do lists
        self.assertIn('HiFiDraw', self.browser.title)

        page_header = self.browser.find_element_by_tag_name('h1').text
        self.assertIn('HiFi Draw', page_header)

        # She notices a table row, which seems to want some source input
        src_input_box = self.browser.find_element_by_id('id_src_1')
        self.assertEqual(
            src_input_box.get_attribute('placeholder'),
            'source name'
        )

        # She notices a table row, which seems to want some destination input
        dst_input_box = self.browser.find_element_by_id('id_dst_1')
        self.assertEqual(
            dst_input_box.get_attribute('placeholder'),
            'destination name'
        )

        # She notices that there is a blank area at the bottom of the page with no drawing in it
        rects = self.browser.find_elements_by_tag_name('rect')
        paths = self.browser.find_elements_by_tag_name('path')
        svgs  = self.browser.find_elements_by_tag_name('svg')
        self.assertEqual(len(rects), 0)
        self.assertEqual(len(paths), 0)
        self.assertEqual(len(svgs), 1)

        # She enters a source and destination and clicks the button        
        src_input_box.send_keys("Edith's iPhone")
        dst_input_box.send_keys("Mackie CR3s")
        button = self.browser.find_element_by_id("btnAdd")
        button.click()
        time.sleep(0.5)

        # She sees a new row, making a total of four in the table
        # (one header, one for the button, the auto first row and the new one)
        all_rows = self.browser.find_elements_by_tag_name('tr')
        self.assertEqual(len(all_rows), 4)

        # She also sees that her diagram has been drawn with two rects and a path
        rects = self.browser.find_elements_by_tag_name('rect')
        paths = self.browser.find_elements_by_tag_name('path')
        self.assertEqual(len(rects), 2)
        self.assertEqual(len(paths), 1)

        self.assertFalse(True, "We're not done yet!")

        # Her source and destination are named but the generic connector is not
        source_text = self.browser.find_element_by_id('id_component_1')
        dest_text = self.browser.find_element_by_id('id_component_2')
        # TODO we have the source and dest elements but we want the actual text
        self.assertEqual("Edith's iPhone", source_text)
        self.assertEqual("Mackie CR3s", dest_text)

    def test_keyboard_shortcuts(self):
        # There should be a total of three in the table;
        # one header, one for the button and the auto first row
        all_rows = self.browser.find_elements_by_tag_name('tr')
        self.assertEqual(len(all_rows), 3)

        # She notices a table row, which seems to want some source input
        src_input_box = self.browser.find_element_by_id('id_src_1')
        dst_input_box = self.browser.find_element_by_id('id_dst_1')

        src_input_box.send_keys("Edith's iPhone")
        dst_input_box.send_keys("Mackie CR3s")
        dst_input_box.send_keys(Keys.RETURN)
        time.sleep(0.5)

        # There should be a total of four in the table;
        # one header, one for the button, the auto first row and the new one
        all_rows = self.browser.find_elements_by_tag_name('tr')
        self.assertEqual(len(all_rows), 4)

        #
        # # When she hits enter, the page updates, and now the page lists
        # # "1: Buy peacock feathers" as an item in a to-do list table
        # input_box.send_keys(Keys.ENTER)
        # time.sleep(1)
        # self.check_for_row_in_list_table('1: Buy peacock feathers')
        #
        # # There is still a text box inviting her to add another item. She
        # # enters "Use peacock feathers to make a fly" (Edith is very
        # # methodical)
        # input_box = self.browser.find_element_by_id('id_new_item')
        # input_box.send_keys('Use peacock feathers to make a fly')
        # input_box.send_keys(Keys.ENTER)
        # time.sleep(1)
        #
        # # The page updates again, and now shows both items on her list
        # self.check_for_row_in_list_table('1: Buy peacock feathers')
        # self.check_for_row_in_list_table('2: Use peacock feathers to make a fly')
        #
        # # Edith wonders whether the site will remember her list. Then she sees
        # self.fail("We haven't finished yet!")


if __name__ == '__main__':
    unittest.main()
