from selenium import webdriver
from selenium.common.exceptions import WebDriverException
# from selenium.webdriver.common.keys import Keys
from selenium.webdriver.firefox.options import Options
import unittest
import time
from selenium.webdriver.common.keys import Keys

# NOTE: You may need to download geckodriver, if you are using linux and haven't already downloaded it


def wait_ten_seconds_for_one(some_function):
    def decorated_function(the_self, arg_one):
        max_wait = 10
        start_time = time.time()
        # print("Timer started")
        while True:
            try:
                return some_function(the_self, arg_one)
            except (AssertionError, WebDriverException) as e:
                if time.time() - start_time > max_wait:
                    # print("waiting for up to ten seconds")
                    raise e
                time.sleep(0.5)

    return decorated_function


class TestNewVisitor(unittest.TestCase):
    def setUp(self):
        options = Options()
        options.add_argument("--headless")
        self.browser = webdriver.Firefox(options=options)
        self.browser.get('http://localhost:8009/')

    def tearDown(self):
        self.browser.quit()

    @wait_ten_seconds_for_one
    def check_for_href_and_download_in_element(self, element_id):
        download_button = self.browser.find_element_by_id(element_id)
        download_link = download_button.get_attribute('href')
        self.assertIsNotNone(download_link)

        download_filename = download_button.get_attribute('download')
        self.assertEqual(download_filename, 'HiFiDraw.png')

    def can_make_super_simple_diagram(self):
        # Edith wants to make a super simple diagram to of her iPhone and active monitors.
        # Someone gives her a link to our site
        # self.browser.get('http://localhost:8009/')

        # She notices the page title and header mention to-do lists
        self.assertIn('HiFiDraw', self.browser.title)

        # ToDo Come back to these
        # page_header = self.browser.find_element_by_tag_name('h1').text
        # self.assertIn('HiFi Draw', page_header)

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
    #
    #     # She notices that there is a blank area at the bottom of the page with no drawing in it
    #     rects = self.browser.find_elements_by_tag_name('rect')
    #     paths = self.browser.find_elements_by_tag_name('path')
    #     svgs  = self.browser.find_elements_by_tag_name('svg')
    #
    #     self.assertEqual(len(rects), 0, "Page should start with no rectangles.")
    #     self.assertEqual(len(paths), 0, "Page should start with no paths.")
    #     self.assertEqual(len(svgs), 1, "Page should start with one svg element.")
    #
    #     # She enters a source and destination and clicks the button
    #     src_input_box.send_keys("Edith's iPhone")
    #     dst_input_box.send_keys("Mackie CR3s")
    #     button = self.browser.find_element_by_id("btnAdd")
    #     button.click()
    #     time.sleep(0.5)
    #
    #     # She sees a new row, making a total of four in the table
    #     # (one header, one for the button, the auto first row and the new one)
    #     all_rows = self.browser.find_elements_by_tag_name('tr')
    #     self.assertEqual(len(all_rows), 4, "Expected four rows in table after button click.")
    #
    #     # She also sees that her diagram has been drawn with two rects and a path
    #     rects = self.browser.find_elements_by_tag_name('rect')
    #     paths = self.browser.find_elements_by_tag_name('path')
    #
    #     paths = [p for p in paths if p.get_attribute('id') != 'raphael-marker-block']
    #
    #     self.assertEqual(len(rects), 2, "Expected two rectangles after button click.")
    #     self.assertEqual(len(paths), 1, "Expected one path after button click")

    def test_keyboard_shortcuts(self):
        # There should be a total of three in the table;
        # one header, one for the button and the auto first row
        all_rows = self.browser.find_elements_by_tag_name('tr')
        self.assertEqual(len(all_rows), 3, "Expected three rows to begin with.")

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
        self.assertEqual(len(all_rows), 4, "Expected four rows after ENTER keystroke.")

    def test_can_delete_rows(self):
        # We begin with some rows
        start_rows = self.browser.find_elements_by_tag_name('tr')
        num_rows_start = len(start_rows)

        # Try to delete a row
        self.browser.find_element_by_xpath("//input[@value='Delete']").click()

        end_rows = self.browser.find_elements_by_tag_name('tr')
        num_rows_end = len(end_rows)

        self.assertEqual(num_rows_start-1, num_rows_end)

    def test_can_download_png(self):
        self.check_for_href_and_download_in_element('id_download')

    def test_there_is_export_link(self):
        export_link = self.browser.find_element_by_id('id_export_link')
        current_url = self.browser.current_url
        self.assertTrue(current_url in export_link.text)


if __name__ == '__main__':
    unittest.main()
