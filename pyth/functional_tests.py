from selenium import webdriver
# from selenium.webdriver.common.keys import Keys
import unittest
# import time


# NOTE: You may need to download geckodriver, if you are using linux and haven't already dowloaded it

class TestNewVisitor(unittest.TestCase):
    def setUp(self):
        self.browser = webdriver.Firefox()

    def tearDown(self):
        self.browser.quit()

    def test_can_make_super_simple_diagram(self):
        # Edith wants to make a super simple diagram to of her iPhone and active monitors.
        # Someone gives her a link to our site
        self.browser.get('http://localhost:8009/')

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
        src_input_box = self.browser.find_element_by_id('id_dst_1')
        self.assertEqual(
            src_input_box.get_attribute('placeholder'),
            'destination name'
        )

        # She enters a souce name into the first box
        src_input_box.send_keys("Edith's iPhone")


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
